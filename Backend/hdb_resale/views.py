from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .ai_prediction import predict_prices_for_town
import pandas as pd
import os
import json

# load and prepare hdb resale data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "data", "hdb_resale_prices_data.csv")

if not os.path.exists(DATA_FILE):
    raise FileNotFoundError("Data file not found. Ensure 'hdb_resale_prices_data.csv' is available.")

df = pd.read_csv(DATA_FILE)
df.dropna(inplace=True)
df.drop_duplicates(inplace=True)
df['resale_price'] = pd.to_numeric(df['resale_price'], errors='coerce')
df['month'] = pd.to_datetime(df['month'], errors='coerce')
df['year'] = df['month'].dt.year
df['town'] = df['town'].str.upper()
df['flat_type'] = df['flat_type'].str.upper()

# get list of towns
@api_view(['GET'])
def get_towns(request):
    towns = df['town'].unique().tolist()
    return Response({'towns': towns}, status=status.HTTP_200_OK)

# get list of years
@api_view(['GET'])
def get_years(request):
    years = df['year'].unique().tolist()
    return Response({'years': sorted(years)}, status=status.HTTP_200_OK)

# Return resale price trends by Town for a single Room Type
@api_view(['GET'])
def resale_analysis(request):
    towns = request.GET.getlist('towns')
    analysis_type = request.GET.get('type', 'price_trends')
    start_year = request.GET.get('start_year')
    end_year = request.GET.get('end_year')
    room_type = request.GET.get('room_type')

    if not towns:
        return Response({'error': 'No towns selected'}, status=status.HTTP_400_BAD_REQUEST)

    filtered_df = df[df['town'].isin([t.upper() for t in towns])]

    if room_type:
        filtered_df = filtered_df[filtered_df['flat_type'] == room_type.upper().strip().replace("-", " ")]

    if start_year and end_year:
        filtered_df = filtered_df[
            (filtered_df['year'] >= int(start_year)) & 
            (filtered_df['year'] <= int(end_year))
        ]

    if filtered_df.empty:
        return Response([], status=status.HTTP_200_OK)

    if analysis_type == "price_trends":
        if room_type:
            result = filtered_df.groupby(['town', 'year'])['resale_price'].mean().reset_index()
        else:
            result = filtered_df.groupby(['flat_type', 'year'])['resale_price'].mean().reset_index()
    elif analysis_type == "volatility":
        result = filtered_df.groupby(['town', 'year'])['resale_price'].std().reset_index()
    else:
        return Response({'error': 'Invalid analysis type.'}, status=status.HTTP_400_BAD_REQUEST)

    return Response(result.to_dict(orient='records'), status=status.HTTP_200_OK)


# Return resale price trends by room type for a single town
@api_view(['GET'])
def resale_roomtype_trends(request):
    town = request.GET.get('town')
    start_year = request.GET.get('start_year')
    end_year = request.GET.get('end_year')

    if not town:
        return Response({'error': 'Missing town parameter.'}, status=status.HTTP_400_BAD_REQUEST)

    filtered_df = df[df['town'] == town.upper()]

    if start_year and end_year:
        filtered_df = filtered_df[
            (filtered_df['year'] >= int(start_year)) & 
            (filtered_df['year'] <= int(end_year))
        ]

    if filtered_df.empty:
        return Response([], status=status.HTTP_200_OK)

    result = (
        filtered_df.groupby(['year', 'flat_type'])['resale_price']
        .mean()
        .reset_index()
        .rename(columns={'resale_price': 'avg_price'})
        .sort_values(['year', 'flat_type'])
    )

    return Response(result.to_dict(orient='records'), status=status.HTTP_200_OK)


# Return Average resale prices by Town over time (Table)
@api_view(['GET'])
def resale_comparison(request):
    towns = request.GET.getlist('towns')
    start_month = request.GET.get('start_year')
    end_month = request.GET.get('end_year')

    if not towns or not start_month or not end_month:
        return Response({'error': 'Missing required parameters.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        start_date = pd.to_datetime(start_month)
        end_date = pd.to_datetime(end_month)
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM.'}, status=status.HTTP_400_BAD_REQUEST)

    filtered_df = df[
        (df['town'].isin([t.upper() for t in towns])) &
        (df['month'] >= start_date) &
        (df['month'] <= end_date)
    ]

    if filtered_df.empty:
        return Response([], status=status.HTTP_200_OK)

    result = (
        filtered_df.groupby('town')['resale_price']
        .mean()
        .reset_index()
        .rename(columns={'resale_price': 'avg_price'})
    )

    return Response(result.to_dict(orient='records'), status=status.HTTP_200_OK)


# Return Average resale prices by Town over time (Graph)
@api_view(['GET'])
def comparison_graph(request):
    towns = request.GET.getlist('towns')
    start_month = request.GET.get('start_year')
    end_month = request.GET.get('end_year')
    interval = request.GET.get('interval', 'month')

    if not towns or not start_month or not end_month:
        return Response({'error': 'Missing parameters.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        start_date = pd.to_datetime(start_month)
        end_date = pd.to_datetime(end_month)
    except ValueError:
        return Response({'error': 'Invalid date format. Use YYYY-MM.'}, status=status.HTTP_400_BAD_REQUEST)

    filtered_df = df[
        (df['town'].isin([t.upper() for t in towns])) &
        (df['month'] >= start_date) &
        (df['month'] <= end_date)
    ]

    if filtered_df.empty:
        return Response([], status=status.HTTP_200_OK)

    if interval == 'year':
        filtered_df['period'] = filtered_df['month'].dt.year.astype(str)
    else:
        filtered_df['period'] = filtered_df['month'].dt.to_period('M').astype(str)

    grouped = (
        filtered_df.groupby(['period', 'town'])['resale_price']
        .mean()
        .reset_index()
        .rename(columns={'period': 'date', 'resale_price': 'avg_price'})
    )

    return Response(grouped.to_dict(orient='records'), status=status.HTTP_200_OK)


# Return All Raw Data by Town
@api_view(['GET'])
def raw_data_by_town(request):
    town = request.GET.get('town')
    room_type = request.GET.get('room_type')

    if not town:
        return Response({'error': 'Missing required parameter (town).'}, status=status.HTTP_400_BAD_REQUEST)

    start_date = pd.to_datetime('2017-01')
    end_date = pd.to_datetime('2025-12')

    filtered_df = df[
        (df['town'] == town.upper()) &
        (df['month'] >= start_date) &
        (df['month'] <= end_date)
    ]

    if room_type:
        filtered_df = filtered_df[filtered_df['flat_type'].str.upper() == room_type.upper()]

    if filtered_df.empty:
        return Response([], status=status.HTTP_200_OK)
    
    filtered_df['month'] = filtered_df['month'].dt.strftime('%Y-%m')

    return Response(filtered_df.to_dict(orient='records'), status=status.HTTP_200_OK)


# Predict future resale prices using linear regression Model
@api_view(['GET'])
def ai_price_prediction(request):
    town = request.GET.get('town')
    flat_type = request.GET.get('flat_type')

    if not town:
        return Response({'error': 'Missing required parameter: town'}, status=status.HTTP_400_BAD_REQUEST)

    result = predict_prices_for_town(df, town, years=5, base_year=2025, flat_type=flat_type)

    if "error" in result:
        return Response(result, status=status.HTTP_400_BAD_REQUEST)

    return Response(result, status=status.HTTP_200_OK)