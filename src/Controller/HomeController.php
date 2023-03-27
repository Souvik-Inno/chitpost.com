<?php

namespace App\Controller;


// use App\LinkedInService\LinkedInService;
use App\Entity\Comment;
use App\Entity\Post;
use App\Entity\User;
use App\Repository\PostRepository;
use App\Service\LinkedInService;
use Doctrine\ORM\EntityManagerInterface;
use Hybridauth\Provider\LinkedIn;
use phpDocumentor\Reflection\Types\Void_;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
// use Symfony\Component\BrowserKit\Cookie;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;


/**
 *  HomeController controls all the routes.
 */
class HomeController extends AbstractController {

	/**
	 *  Renders to the Login Page by default.
	 */
	#[Route('', name: 'app_home')]
	public function index(): Response {
		return $this->render('home/index.html.twig', [
			'controller_name' => 'HomeController',
			'errormessage' => '',
		]);
	}

	/**
	 *  Routes user to the signup page.
	 */
	#[Route('/signup', name: 'signup_home')]
	public function signup(): Response {
		return $this->render('home/signup.html.twig', [
			'controller_name' => 'HomeController',
		]);
	}

	/**
	 *  Gets start and end index from ajax and returns next 10 posts.
	 */
	#[Route('/iterator', name: 'iterator_home')]
	public function iterate(Request $request, EntityManagerInterface $entityManager): Response {
		$startIndex = $request->request->get("startIndex");
		$endIndex = $request->request->get("endIndex");
		$startIndex = $endIndex;
		$endIndex += 10;
		$postindex = count($entityManager->getRepository(Post::class)->findAll()) - $startIndex;
		$posts = $entityManager->getRepository(Post::class);
		$query = $posts->createQueryBuilder('e')
                ->setFirstResult($startIndex) // Starting from 10th record
                ->setMaxResults(10) // Number of records to retrieve
                ->getQuery();

		$elements = $query->getResult();
		$uservalue = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('userEmail')]);
		$postsdata = [];
		$endreached = 0;
		if (count($elements) < 10) {
			$endreached = 1;
		}

		foreach($elements as $element) {
			$commentsval = $element->getComments();
			$comments = [];
			foreach ($commentsval as $comment) {
				$comments = [
					'text' => $comment->getText(),
					'profilepic' => $comment->getUser()->getProfilePic(),
				];
			}

			$postsdata[] = [
				'profilepic' => $element->getUser()->getProfilePic(),
				'username' => $element->getUser()->getUserName(),
				'time' => $element->getTime()->format('F j, Y, g:i a'),
				'posttext' => $element->getText(),
				'likecondition' => $uservalue->getPostsliked()->contains($element),
				'likes' => $element->getLikes(),
				'commentslength' => count($element->getComments()),
				'comments' => $comments,
				'id' =>$element->getId(),
				'picture' =>$element->getImage(),
			];
		}

		return new JsonResponse([
			'startIndex' => $startIndex,
			'endIndex' => $endIndex,
			'posts' => $postsdata,
			'endreached' => $endreached,
		]);
	}

	/**
	 *  Gets data from ajax and likes or unlikes the given post.
	 */
	#[Route('/like', name: 'like_home')]
	public function like(Request $request, EntityManagerInterface $entityManager): JsonResponse {
		$postId = $request->request->get('postId');
		$postvalue = $entityManager->getRepository(Post::class)->findOneBy(['id' => $postId]);
		$uservalue = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('userEmail')]);
		$likes = $postvalue->getLikes();
		if (!$uservalue->getPostsliked()->contains($postvalue)) {
			$likes = $postvalue->getLikes() + 1;
			$uservalue->addPostsliked($postvalue);
			$postvalue->addUsersliked($uservalue);
			$liked = 1;
		}
		else {
			$likes = $postvalue->getLikes() - 1;
			$uservalue->removePostsliked($postvalue);
			$postvalue->removeUsersliked($uservalue);
			$liked = 0;
		}
		$postvalue->setLikes($likes);
		$entityManager->persist($postvalue);
		$entityManager->persist($uservalue);
		$entityManager->flush();
		return new JsonResponse([
			'likes' => $likes,
			'liked' => $liked,
		]);
	}

	/**
	 *  Gets post and user from ajax and adds comment to the given post.
	 */
	#[Route('/comment', name: 'comment_home')]
	public function comment(Request $request, EntityManagerInterface $entityManager): JsonResponse {
		$commentdata = new Comment;
		$uservalue = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('userEmail')]);
		$postvalue = $entityManager->getRepository(Post::class)->findOneBy(['id' => $request->request->get('postId')]);
		$commentdata->setPost($postvalue);
		$commentdata->setUser($uservalue);
		$commentdata->setText($request->request->get('comment'));
		$entityManager->persist($commentdata);
		$entityManager->flush();
		return new JsonResponse([
			'comment' => $commentdata->getText(),
			'profilepic' => $uservalue->getProfilePic(),
			'commentcount' => count($postvalue->getComments()),
		]);
	}
	
	/**
	 *  Logs in or Signs up the user using normal method or linkedin then sends to the feed page.
	 */
	#[Route('/feed', name: 'app_login')]
	public function linkedInLogin(EntityManagerInterface $entityManager): Response {
		if (isset($_POST['loginSubmit'])) {
			$uservalue = $entityManager->getRepository(User::class)->findOneBy(['email' => $_POST['loginEmail'], 'password' => $_POST['loginPass']]);
			if ($uservalue == NULL) {
				$errorMessage = 'Give correct Email Id';
				// $si->set('logged', TRUE);
				// $si->set('email', $_POST['loginEmail']);
				return $this->render('home/index.html.twig', [
					'controller_name' => 'HomeController',
					'errormessage' => $errorMessage,
				]);
			}
			else {
				$userdata = $uservalue;
				// $si->set('logged', TRUE);
				// $si->set('email', $_POST['loginEmail']);
			}
		}
		else if (isset($_POST['signUpSubmit'])) {
			$uservalue = $entityManager->getRepository(User::class)->findOneBy(['email' => $_POST['signupEmail']]);
			if ($uservalue == NULL) {
				$userdata = new User;
				$userdata->setEmail($_POST['signupEmail']);
				$userdata->setUserName($_POST['inputName']);
				$userdata->setPassword($_POST['signUpPass']);
				$userdata->setProfilePic("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");
				$entityManager->persist($userdata);
				$entityManager->flush();
			}
			else {
				$userdata = $uservalue;
			}
			// $si->set('logged', TRUE);
			// $si->set('email', $_POST['signupEmail']);
		}
		else{
			$data = new LinkedInService();
			$userProfile = $data->getProfile();
			$uservalue = $entityManager->getRepository(User::class)->findOneBy(['email' => $userProfile->email]);
			if($uservalue == NULL || $uservalue->getEmail() != $userProfile->email) {
				$userdata = new User;
				$userdata->setEmail($userProfile->email);
				$userdata->setUserName($userProfile->displayName);
				$userdata->setProfilePic($userProfile->photoURL);
				$entityManager->persist($userdata);
				$entityManager->flush();
			}
			else {
				$userdata = $uservalue;
			}
		}

		$posts = $entityManager->getRepository(Post::class)->findBy([], ['id' => 'ASC'], 10);
		
		return $this->render('home/feed.html.twig', [
			'controller_name' => 'HomeController',
			'userdata' => $userdata,
			'posts' => $posts,
		]);
	}

	#[Route('/logout', name: 'app_logout')]
	public function logout(): Response {
		// $si->remove('logged');
		// $si->remove('email');
		return $this->render('home/index.html.twig', [
			'controller_name' => 'HomeController',
			'errormessage' => '',
		]);
	}

	/**
	 *  Gets post text and image from ajax call then publishes the post.
	 */
	#[Route('/upload', name: 'post_upload')]
	public function uploadPost(Request $request, EntityManagerInterface $entityManager): JsonResponse {
		$data = new Post;
		$value = $entityManager->getRepository(User::class)->findOneBy(['email' => $request->request->get('userEmail')]);
		$data->setText($request->request->get('post-text'));
		$date = new \DateTime('@'.strtotime('now'));
		$data->setTime($date);
		$data->setUser($value);

		// $image = $request->request->get('picture');

		if ($request->files->get('picture') !== NULL) {
			$image = $request->files->get('picture');
			$extension = $image->guessExtension();
			$newFileName = uniqid() . "." . $extension;
			try {
				$image->move(
					$this->getParameter('kernel.project_dir') . '/public/uploads/',
					$newFileName
				);
			} catch (FileException $e) {
				dd($e);
			}
			$data->setImage('/uploads/' .$newFileName);
		}

		$message = 'Values stored successfully';
		$entityManager->persist($data);
		$value->addPost($data);
		$entityManager->persist($value);
		$entityManager->flush();

		return new JsonResponse([
			'success' => true,
			'message' => $message,
			'id' => $data->getId(),
			'user' => $data->getUser(),
		]);
	}
	
}
