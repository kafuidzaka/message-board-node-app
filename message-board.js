//var url = "https://demoapp1-a502466.apaas.us2.oraclecloud.com/";
//var url = "https://nodemessageboard-a502466.apaas.us2.oraclecloud.com";
var url = "";
//var url = "http://localhost:8089";
      //Hide all elements; display loading screen
      function hideAll() {
        document.getElementById('topic_list').setAttribute('style', 'display:none');
        document.getElementById('new_topic').setAttribute('style', 'display:none');
        document.getElementById('topic_detail').setAttribute('style', 'display:none');
        document.getElementById('comment').setAttribute('style', 'display:none');
        document.getElementById('loading').setAttribute('style', '');
      }
      // Load all the topics
      function loadAllTopics() {
        hideAll();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url + "/", true);
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var topics = JSON.parse(xmlhttp.responseText);
            var tStr = '<h1>The Bulletin</h1>';
            tStr += '<ul>';
            for (i = 0; i < topics.length; i++) {
              tStr += '<li><a href="#" onclick="displayTopic(' + topics[i].id + ')">' + topics[i].title + '</a></li>';
            }
            tStr += '</ul>';
            document.getElementById('topic_list').innerHTML = tStr;
            document.getElementById('loading').setAttribute('style', 'display:none');
            document.getElementById('new_topic').setAttribute('style', '');
            document.getElementById('topic_list').setAttribute('style', '');
            document.getElementById('return_to_topic_list').setAttribute('style', 'display:none');
          }
        };
        xmlhttp.send();
      }
      //If the user clicks a topic, then display the topic on screen
      function displayTopic(topicId) {
        hideAll();
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url + "/" + topicId, true);
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            var topic = JSON.parse(xmlhttp.responseText);

            document.getElementById("comment_topic_id").value = topicId;
            document.getElementById("topic_detail_title").innerHTML = topic.title;
            document.getElementById("topic_detail_text").innerHTML = topic.text;
            //var deleteButton = document.getElementById('delete_comment_button').setAttribute('style', ''); 
            //var deleteButtonString = document.getElementById('delete_comment_button').outerHTML; 
            //when uncommenting above code, add deleteButton String Variable to comments variable
             
            var comments = "<ul>";
            for (i = 0; i < topic.comments.length; i++) {
              var topicId_string = topicId.toString();  
              var unique_comment_id = topicId_string + i ; 
              
                comments += "<li " + "id=" + unique_comment_id + ">" + topic.comments[i] + "</li>";  
            }
            comments += "</ul>";
            
            document.getElementById("topic_detail_comments").innerHTML = comments;
            document.getElementById('loading').setAttribute('style', 'display:none');
            document.getElementById('topic_detail').setAttribute('style', '');
            document.getElementById('comment').setAttribute('style', '');
            document.getElementById('return_to_topic_list').setAttribute('style', '');
          }
        };
        xmlhttp.send();
      }
      //If adding a new topic
      function addNewTopic() {
        hideAll();
        var newTopic = {};
        newTopic.title = document.getElementById('new_topic_title').value;
        newTopic.text = document.getElementById('new_topic_text').value;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url + "/", true);
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
              loadAllTopics(); 
          }
        };
        xmlhttp.send(JSON.stringify(newTopic));
       
      }
      //If adding a new comment
    function addNewComment() {
        hideAll();
        var newComment = {};
        newComment.topicId = document.getElementById('comment_topic_id').value;
        newComment.text = document.getElementById('comment_text').value;
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", url + "/" + newComment.topicId, true);
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            displayTopic(newComment.topicId);
          }
        };
        xmlhttp.send(JSON.stringify(newComment));
        document.getElementById('new_comment').reset();
      }

    function remove(array, element) {
    return array.filter(e => e !== element);
    }
    
    /*
    function removeComment(comment_element) {
        hideAll();
        var currentCommentId = $(comment_element).parentsUntil("#topic_detail_comments", "li").attr("id");
        var topicId = document.getElementById('comment_topic_id').value;
        var currentCommentIndex = currentCommentId.replace(topicId,"");
        var currentCommentIndex = parseInt(currentCommentIndex);
        
        var result = {};
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("PATCH", url + "/" + topicId, true);
        xmlhttp.onreadystatechange = function () {
          if (xmlhttp.readyState === 4 && xmlhttp.status === 200) { 
            var topic = JSON.parse(xmlhttp.responseText);
            console.log(topic.comments);
            console.log(currentCommentIndex);    
            console.log(topicId);  
            
            result = remove(topic.comments, topic.comments[currentCommentIndex]);
            console.log(result);  

          }
        };
        xmlhttp.send(JSON.stringify(result));
        displayTopic(topicId);
      }
      */


      /*
        function removeComment(comment_element) {
        var currentComment = $(comment_element).parentsUntil("#topic_detail_comments", "li").attr("id");
          console.log(currentComment);
          $('#'+currentComment).remove();
      }
      */

      window.onload = function () {
        hideAll();
        loadAllTopics();
      }