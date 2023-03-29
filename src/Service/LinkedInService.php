<?php

  /**
   *  @file contains class LinkedInService.
   */
  namespace App\Service;

  use Hybridauth\Provider\LinkedIn;
  use App\Entity\User;

  /**
   *  Class contains method to connect to LinkedIn.
   */
  class LinkedInService {

    /**
     *  Method to connect to LinkedIn and get profile.
     * 
     *  @return \Hybridauth\User\Profile
     *    Returns user profile after fetching from LinkedIn.
     */
    public function getProfile() {
      $config = [
        'callback' => 'http://chitpost.com/feed',
        'keys'     => [
          'id' => '77nnb4msuxfc7j',
          'secret' => 'qU86DHq4T48ntbQ4'
        ],
        'scope'    => 'r_liteprofile r_emailaddress w_member_social',
      ];
      $adapter = new LinkedIn($config);
      $adapter->authenticate();
		  $userProfile = $adapter->getUserProfile();
      return $userProfile;
    }

  }
?>
