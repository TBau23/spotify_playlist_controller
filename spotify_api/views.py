from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework.response import Response
from requests import Request, post
import os
from .utils import update_or_create_user_tokens
from django.shortcuts import redirect, render

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
            'response_type' : 'code',
            'redirect_uri' : REDIRECT_URI,
            'client_id' : CLIENT_ID
        }).prepare().url # returns an authentication url
        # give this url to the front end 

        return Response({'url' : url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')

    # using the code gives us access to all the info below from the response

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type' : 'authorization_code',
        'code' : code,
        'redirect_uri' : REDIRECT_URI,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type') # 'Bearer'
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    # need to store these tokens for any host users 
    # map session key with access tokens for hosts
    # thus we need to make a model

    if not request.session.exists(request.session.session_key):
        request.session.create()

    update_or_create_user_tokens(request.session.session_key, refresh_token, access_token, expires_in, token_type)
    # once we have tokens, send user back to frontend homepage 
    return redirect('frontend:')

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        