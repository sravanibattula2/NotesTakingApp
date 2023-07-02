import json
import humps
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync

from .models import Comment


class CommentConsumer(WebsocketConsumer):
    def connect(self):
        # Add the user to the comment group
        self.room_group_name = "comment_group"
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                "type": "comment",
                "message": self.get_all_comments()
            }
        )

    def save_comment(self, data):
        comment = Comment(
            start_index=data["startIndex"],
            length=data["length"],
            text=data["text"]
        )
        comment.save()

    def get_all_comments(self) -> str:
        # Get all comments from the database
        comments = Comment.objects.all().values(
            'id',
            'start_index',
            'length',
            'text'
        )

        # Convert the QuerySet to a list
        comments = json.loads(json.dumps(list(comments)))

        # Convert the keys to camel case
        camel_case_comments = [
            self.convert_keys_to_camel_case(comment) for
            comment in comments
        ]

        # Convert the comments to JSON
        comments_json = json.dumps(camel_case_comments)
        return comments_json

    def convert_keys_to_camel_case(self, json_dict):
        new_dict = {}
        for key in json_dict:
            camelized_key = humps.camelize(key)
            new_dict[camelized_key] = json_dict[key]
        return new_dict

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        type = text_data_json["type"]
        data = text_data_json["data"]

        if (type == "comment"):
            # Save the comment to the database
            self.save_comment(data)

            async_to_sync(self.channel_layer.group_send)(
                self.room_group_name,
                {
                    "type": "comment",
                    "message": self.get_all_comments()
                }
            )

    def comment(self, event):
        message = event["message"]

        self.send(
            text_data=json.dumps({
                "type": "comment-list",
                "message": message
            })
        )
