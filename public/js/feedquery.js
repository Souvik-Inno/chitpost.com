var clicked = false;
var startIndex = 0;
var endIndex = 10;
var lcount = 0;
var isRev = false;
var saveTemplate = $("#posts-list").html();

// Performing the show more feature using ajax.
function showMore() {
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
            var divItem = document.createElement('li');
            divItem.idName = 'posted';
            var c = 0;
            startIndex = data.startIndex;
            endIndex = data.endIndex;

            if(data.endreached == 1) {
                $('#show-more-btn').hide();
            }
            
            // Handle the success response from the server.
            for (let index = startIndex; index < endIndex; index++) {
                commentsItem = ``;
                var commenItem = document.createElement('li');
                commenItem.idName = 'commentpost';
                var comments = data.posts[c].comments;
                

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
                    </ul>
                </div>
                `;
                $("#posts-list").append(divItem);

                for (let itr = comments.length - 1; itr >= 0 ; itr--) {
                    commentsItem = `
                    <div class="comment box">
                        <div class="status-main" id="comment-main">
                            <img src=${comments[itr].profilepic} class="comment-img">
                            <textarea id="comment-box-form" class="comment-textarea" name="post-text" disabled>${comments[itr].text}</textarea>
                        </div>
                    </div>`;
                    $(".comments-section").eq(index).append(commentsItem);
                }
                c++;
            }
            saveTemplate = $("#posts-list").html();
        },
        error: function (xhr, status, error) {
            // Handle the error response from the server
            console.log('Error: ' + error);
        }
    });
}

// Using ajax to reverse the list of post shown.
function reverseArr() {
    isRev = !isRev;
    if (isRev) {
        saveTemplate = $("#posts-list").html();
        lcount = 0;
        $.ajax({
            url: "/reverse",
            type: "POST",
            datatype: "json",
            data: {
                'startIndex': startIndex,
                'endIndex': endIndex,
                'userEmail': $('#usermailvalue').val(),
            },
            success: function (data) {
                var divItem = document.createElement('li');
                divItem.idName = 'posted';
                startIndex = data.startIndex;
                endIndex = data.endIndex;
                var c = 0;
    
                if(data.endreached == 1) {
                    $('#show-more-btn').hide();
                }
                $("#posts-list").html("");
    
                for (let index = endIndex - 1; index >= 0; index--) {
                    var commentsItem = ``;
                    var commenItem = document.createElement('li');
                    commenItem.idName = 'commentpost';
                    var comments = data.posts[index].comments;
    
                    divItem = `
                    <input type="text" value=${data.posts[index].id} name="postdata" class="postdata">
                    <div class="post box">
                        <div class="status-main">
                            <img src=${data.posts[index].profilepic} class="status-img">
                            <div class="post-detail">
                                <div class="post-title">
                                    <strong>${data.posts[index].username}</strong>
                                    created new
                                    <span>post</span>
                                </div>
                                <div class="post-date">${data.posts[index].time}</div>
                            </div>
                            <button class="intro-menu"></button>
                        </div>
                        <div class="post-content">${data.posts[index].posttext}
                            <div class="post-photos">
                            ${data.posts[index].picture ? `<img src=${data.posts[index].picture} class="post-photo">` : ``}
                            </div>
                        </div>
                        <div class="post-actions">
                            <a href="#" class="post-action like-action" onclick="morelikeposts(${index})" id="${index}">
                            
                                ${data.posts[index].likecondition ? `<svg stroke="currentColor" stroke-width="1" fill="red" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">
                                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                            </svg>` : `<svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>
                        </svg>`}
                                ${data.posts[index].likes}
                            </a>
                            <a href="#" class="post-action comment-icon" onclick="showcomments(${c})">
                                <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1" viewbox="0 0 24 24">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"></path>
                                </svg>
                                ${data.posts[index].commentslength}
                            </a>
                        </div>
                        <div class="post-comment">
                            <input type="text" name="comment-input" class="post-comment-input" placeholder="Enter Comment...">
                            <button id="comment-post-btn" class="comment-share" onclick="commentshare(${index})">Post comment</button>
                        </div>
                        <ul class="comments-section" id="comments-section">
                        </ul>
                    </div>
                    `;
                    $("#posts-list").append(divItem);
                    for (let itr = comments.length - 1; itr >= 0 ; itr--) {
                        commentsItem = `
                        <div class="comment box">
                            <div class="status-main" id="comment-main">
                                <img src=${comments[itr].profilepic} class="comment-img">
                                <textarea id="comment-box-form" class="comment-textarea" name="post-text" disabled>${comments[itr].text}</textarea>
                            </div>
                        </div>`;
                        $(".comments-section").eq(c).append(commentsItem);
                    }
                    c++;
                }
            },
            error: function (xhr, status, error) {
                console.log("status: " + error);
            }
        });
    }
    else {
        $("#posts-list").html(saveTemplate);
    }
}

// Get the iterations and store in lcount variable.
function getcount(count) {
    lcount = count;
}

// Show or hide comments on toggle.
function showcomments(count) {
    var elements = Array.from(document.getElementsByClassName("comments-section"));
    var element = elements[count];
    element.classList.toggle("toggle");
}

// Show comment on comment post.
function showoncomment(count) {
    var elements = Array.from(document.getElementsByClassName("comments-section"));
    var element = elements[count];
    element.classList.add("toggle");
}

// Likes or unlikes the post using ajax.
function morelikeposts(count) {
    var arr = $("input[name='postdata']").map(function () {
        return this.value;
    }).get();
    var ind = count;
    if (isRev) {
        count = arr.length - count - 1;
    }
    var val = arr[count];
    $.ajax({
        url: "/like",
        type: "POST",
        dataType: 'json',
        data: {
            'postId': val,
            'userEmail': $('#usermailvalue').val(),
        },
        success: function (data) {
            // Handle the success response from the server.
            if (data.liked == 1) {
                $('#' + ind).html(
                    '<svg stroke="currentColor" stroke-width="2" fill="red" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">' +
                    '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>' +
                    '</svg>' + data.likes
                );
            }
            else {
                $('#' + ind).html(
                    '<svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewbox="0 0 24 24">' +
                    '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"></path>' +
                    '</svg>' + data.likes
                );
            }
        },
        error: function (xhr, status, error) {
            // Handle the error response from the server.
            console.log('Error: ' + error);
        }
    });
}

// Publish comment using ajax.
function commentshare(count) {
    var arr = $("input[name='postdata']").map(function () {
        return this.value;
    }).get();
    var textarr = $("input[name='comment-input']").map(function () {
        return this.value;
    }).get();
    if (isRev) {
        count = textarr.length - count - 1;
    }
    var val = arr[count];
    var text = textarr[count];
    if (text == "") {
        alert("provide valid comment");
    }
    else {
        $.ajax({
            url: "/comment",
            type: "POST",
            dataType: 'json',
            data: {
                'postId': val,
                'userEmail': $('#usermailvalue').val(),
                'comment': text,
            },
            success: function (data) {
                // Handle the success response from the server.
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
                // Handle the error response from the server.
                console.log('Error: ' + error);
            }
        });
    }
}

$(document).ready(function () {
    var fileData = $('input[type="file"]')[0].files[0];
    $('#image').change(function () {
        fileData = $(this).val();
    });
    // Upload post using ajax.
    $("#status-share-btn").click(function () {
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
            $.ajax({
                url: "/upload",
                type: "POST",
                dataType: 'json',
                data: formData,
                processData: false,
                contentType: false,
                success: function (data) {
                    // Handle the success response from the server.
                    $('#status-box-form').val("");
                    $('input[name="image"]').val("");
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    // Handle the error response from the server.
                    console.log('status: ' + status);
                    console.log('Error: ' + error);
                }
            });
        }
    });
});
