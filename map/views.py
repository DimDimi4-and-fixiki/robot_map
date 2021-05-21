from django.shortcuts import render

# Create your views here.

mapbox_access_token = "pk.eyJ1IjoiZGltZGltaTQiLCJhIjoiY2tveDVsa2IzMGNuNjJvbzI2YWIzcmlmYyJ9.ypDiQfV9wTxGr7cXsE9_Mw"

def index(request):
    return render(request, 'map/index.html', {'mapbox_access_token': mapbox_access_token})

