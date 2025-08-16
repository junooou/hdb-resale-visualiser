from django.contrib.auth.tokens import PasswordResetTokenGenerator

# Generate Token for password reset
class CustomTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return str(user.pk) + str(timestamp)

custom_token_generator = CustomTokenGenerator()