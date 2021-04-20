from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework.response import Response
from requests import Request, post
import os

CLIENT_ID = os.environ['CLIENT_ID']
CLIENT_SECRET = os.environ['CLIENT_SECRET']
REDIRECT_URI = os.environ['REDIRECT_URI']

# Create your views here.

# first task is to get auth for our application
class AuthURL(APIView):
    def get(self, request, format=None):
        scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params= {
            'scope': scope,
            'response-type' : 'code',
            'redirect_uri' : REDIRECT_URI,
            'client_id' : CLIENT_ID
        }).prepare().url # returns an authentication url

        return Response({'url' : url}, status=status.HTTP_200_OK)