from django.urls import path
from . import views

urlpatterns = [
    path('towns/', views.get_towns, name='get_towns'),
    path('years/', views.get_years, name='get_years'),
    path('resale_analysis/', views.resale_analysis, name='resale_analysis'),
    path("resale_comparison/", views.resale_comparison),
    path('comparison_graph/', views.comparison_graph, name='comparison_graph'),
    path("resale_roomtype_trends/", views.resale_roomtype_trends, name='resale_roomtype_trends'),
    path("raw_data_by_town/",views.raw_data_by_town, name='raw_data_by_town'),
    path('ai_predict/', views.ai_price_prediction, name='ai_price_prediction'),
]