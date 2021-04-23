from django.shortcuts import render
from rest_framework.views import APIView, status
from rest_framework.response import Response
from requests import Request, post
import os
from .utils import update_or_create_user_tokens, is_authenticated, send_spotify_api_call
from django.shortcuts import redirect, render
from api.models import Room


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
        # call our authentication util and return json
        is_spotify_authenticated = is_authenticated(self.request.session.session_key)
        return Response({'status': is_spotify_authenticated}, status=status.HTTP_200_OK)

class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get('room_code')
        # current song has to be displayed to more than host - we need to know the room that the request is coming from
        # can then use host info to find song
        query_set = Room.objects.filter(code=room_code)
        if query_set.exists():
            room = query_set[0]
        else:
            return Response({"Error" : "Must be in room"}, status=status.HTTP_404_NOT_FOUND)
        host = room.host
        endpoint = 'player/currently-playing'
        response = send_spotify_api_call(host, endpoint)
        if 'error' in response or 'item' not in response:
            # item is key for current song on the response
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        item = response.get('item')
        duration = item.get('duration_ms')
        progress = response.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = response.get('is_playing')
        song_id = item.get('id')

        # have to clean up artists data for multi artist songs
        artist_string = ""

        for i, artist in enumerate(item.get('artists')):
            if i > 0:
                artist_string += ", "
            name = artist.get("name")



        return Response({"Current Song" : response}, status=status.HTTP_200_OK)
