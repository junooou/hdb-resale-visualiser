from rest_framework import serializers

# Validate Resale Price Format
class ResalePriceSerializer(serializers.Serializer):
    month = serializers.DateField(format="%Y-%m", required=False)
    year = serializers.IntegerField(required=False)
    town = serializers.CharField(max_length=100)
    avg_price = serializers.FloatField(required=False)
    price_volatility = serializers.FloatField(required=False)