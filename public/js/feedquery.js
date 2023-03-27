var startIndex = 10;
var clicked = false;
var startIndex = 0;
var endIndex = 10;

function showMore(rev) {
    console.log("there");
    $.ajax({
        url: "/iterator",
        type: "POST",
        dataType: 'json',
        data: {
            'startIndex': startIndex,
            'endIndex': endIndex,
            'userEmail': $('#usermailvalue').val(),
        },
        success: function (data) {
            // var val = document.querySelector("#posts-list");
            var divItem = document.createElement('li');
            divItem.idName = 'posted';
            console.log(data.posts);
            var c = 0;
            startIndex = data.startIndex;
            endIndex = data.endIndex;
            console.log("code rev is"+rev);

            if(data.endreached == 1) {
                if(rev == 1) {
                    $('#show-more-btn').hide();
                }
                else {
                    $('#show-more-btn-rev').hide();
                }
            }
            
            // Handle the success response from the server
            for (let index = startIndex; index < endIndex; index++) {
                commentsItem = ``;

                comments = data.posts[c].comments;
                for (let itr = comments.length - 1; itr >= 0 ; itr--) {
                    commentsItem += `<li>
                    <div class="comment box">
                        <div class="status-main" id="comment-main">
                            <img src=${comments[itr].profilepic} class="comment-img">
                            <textarea id="comment-box-form" class="comment-textarea" name="post-text" disabled>${comments[itr].text}</textarea>
                        </div>
                    </div>
                </li>`;
                }

                divItem = `
                <input type="text" value=${data.posts[c].id} name="postdata" class="postdata">
                <div class="post box">
                    <div class="status-main">
                        <img src=${data.posts[c].profilepic} class="status-img">
                        <div class="post-detail">
                            <div class="post-title">
                                <strong>${data.posts[c].username}</strong>
                                created new
                                <span>post</span>
                            </div>
                            <div class="post-date">${data.posts[c].time}</div>
                        </div>
                        <button class="intro-menu"></button>
                    </div>
                    <div class="post-content">${data.posts[c].posttext}
                        <div class="post-photos">
                        ${data.posts[c].picture ? `<img src=${data.posts[c].picture} class="post-photo">` : ``}
                        </div>
                    </div>
                    <div class="post-actions">
                        <a href="#" class="post-action like-action" onclick="morelikeposts(${index})" id="${index}">
                        
                            ${data.posts[c].likecondition ? `<svg stroke="currentColor" stroke-width="1" fill="red" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                        </svg>` : `<svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                    </svg>`}
                            ${data.posts[c].likes}
                        </a>
                        <a href="#" class="post-action comment-icon" onclick="showcomments(${index})">
                            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewbox="0 0 24 24">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                            </svg>
                            ${data.posts[c].commentslength}
                        </a>
                    </div>
                    <div class="post-comment">
                        <input type="text" name="comment-input" class="post-comment-input" placeholder="Enter Comment...">
                        <button id="comment-post-btn" class="comment-share" onclick="commentshare(${index})">Post comment</button>
                    </div>
                    <ul class="comments-section" id="comments-section">
                        ${commentsItem}
                    </ul>
                </div>`;
                if(rev == 0) {
                    console.log("revuhu is: "+rev);
                    $("#posts-loaded-more").append(divItem);    
                }
                else {
                    console.log("rev is: "+rev);
                    $("#posts-loaded").append(divItem);
                }
                c++;
            }
        },
        error: function (xhr, status, error) {
            // Handle the error response from the server
            console.log('Error: ' + error);
        }
    });
}
var lcount = 0;
var reverse = true;

function getcount(count) {
    lcount = count;
    console.log(count);
}

function showcomments(count) {
    var elements = Array.from(document.getElementsByClassName("comments-section"));
    var element = elements[count];
    element.classList.toggle("toggle");
}

function showoncomment(count) {
    var elements = Array.from(document.getElementsByClassName("comments-section"));
    var element = elements[count];
    element.classList.add("toggle");
}

function sortposts() {
    console.log("sorting posts");
    reverse = !reverse;
    $("#posts-list, #posts-list-sorted").toggleClass("hidden");
}

function morelikeposts(count) {
    // if (!reverse) {
    //     count = count + arr.length/2;
    // }
    var arr = $("input[name='postdata']").map(function () {
        return this.value;
    }).get();
    var val = arr[count];
    console.log('count is: ' + count);
    console.log('val is:' + val);
    $.ajax({
        url: "/like",
        type: "POST",
        // data: JSON.stringify(formData),
        dataType: 'json',
        data: {
            'postId': val,
            'userEmail': $('#usermailvalue').val(),
        },
        success: function (data) {
            // Handle the success response from the server
            console.log("success likes");
            console.log(data.likes);
            console.log('count is: ' + count);
            if (data.liked == 1) {
                $('#' + count).html(
                    '<svg stroke="currentColor" stroke-width="2" fill="red" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">' +
                    '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>' +
                    '</svg>' + data.likes
                );
            }
            else {
                $('#' + count).html(
                    '<svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">' +
                    '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>' +
                    '</svg>' + data.likes
                );
            }
            // window.location.reload();
        },
        error: function (xhr, status, error) {
            // Handle the error response from the server
            console.log('Error: ' + error);
        }
    });
}

function commentshare(count) {
    var arr = $("input[name='postdata']").map(function () {
        return this.value;
    }).get();
        var val = arr[count];
        console.log(val);
        var textarr = $("input[name='comment-input']").map(function () {
            return this.value;
        }).get();
        var text = textarr[count];
        if (text == "") {
            alert("provide valid comment");
        }
        else {
            console.log("going to server");
            $.ajax({
                url: "/comment",
                type: "POST",
                // data: JSON.stringify(formData),
                dataType: 'json',
                data: {
                    'postId': val,
                    'userEmail': $('#usermailvalue').val(),
                    'comment': text,
                },
                success: function (data) {
                    // Handle the success response from the server
                    console.log($("input[name='comment-input']").eq(count).val());
                    console.log(data.commentcount);
                    $("input[name='comment-input']").eq(count).val('');

                    showoncomment(count);

                    $(".comments-section").eq(count).prepend(
                        '<li>' +
                        '<div class="comment box">' +
                        '<div class="status-main" id="comment-main">' +
                        '<img src=' + data.profilepic + ' class="comment-img">' +
                        '<textarea id="comment-box-form" class="comment-textarea" name="post-text" disabled>' + data.comment + '</textarea>' +
                        '</div>' +
                        '</div>' +
                        '</li>'
                    );
                    $(".comment-icon").eq(count).html(
                        `<svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewbox="0 0 24 24">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                    </svg>` +
                    data.commentcount
                    );
                },
                error: function (xhr, status, error) {
                    // Handle the error response from the server
                    console.log('Error: ' + error);
                }
            });
        }
}

$(document).ready(function () {
    var arr = $("input[name='postdata']").map(function () {
        return this.value;
    }).get();
    // var fileData = $("input[name='image']").val();
    var fileData = $('input[type="file"]')[0].files[0];
    $('#image').change(function () {
        fileData = $(this).val();
        console.log(fileData);
    });
    $("#status-share-btn").click(function () {
        // console.log(fileData['name']);
        fileData = $('input[type="file"]')[0].files[0];
        var formData = new FormData();
        formData.append('post-text', $('#status-box-form').val());
        formData.append('userEmail',$('#usermailvalue').val());
        if (fileData != undefined) {
            formData.append('picture', fileData);
        }
        if ($('#status-box-form').val() == "" && fileData == undefined) {
            alert("Enter valid post");
        }
        else {
            console.log(fileData);
            $.ajax({
                url: "/upload",
                type: "POST",
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    // Handle the success response from the server
                    $('#status-box-form').val("");
                    $('input[name="image"]').val("");
                    console.log(data.message + ' ID: ' + data.id);
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    // Handle the error response from the server
                    console.log('status: ' + status);
                    console.log('Error: ' + error);
                }
            });
        }
    });
});