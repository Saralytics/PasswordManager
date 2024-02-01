# import datetime
# from django.db import models
# from django.utils import timezone
# from django.core.exceptions import ValidationError
# from django.core.validators import MinLengthValidator


# def validate_length(value):
#     if len(value) < 8:
#         raise ValidationError(
#             "This field must not be shorter than 8 characters"
#         )


# class User(models.Model):
#     username = models.CharField(max_length=200)
#     email = models.EmailField()
#     password = models.CharField(max_length=50,validators=[MinLengthValidator(8)])
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
    
#     def __str__(self):
#         return self.username
    

#     def save(self, *args, **kwargs):
#         # This will run all the validations on the model fields
#         self.full_clean()
#         super(User, self).save(*args, **kwargs)