from rest_framework import serializers
from .models import Project, Technology, Category

class TechnologySerializer(serializers.ModelSerializer):
    """Serializer to map the Technology model to JSON."""
    class Meta:
        model = Technology
        fields = ['name']

class CategorySerializer(serializers.ModelSerializer):
    """Serializer to map the Category model to JSON."""
    class Meta:
        model = Category
        fields = ['name']

class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer to map the Project model to JSON.
    Includes nested serializers for readable relationships.
    """
    technologies = serializers.SlugRelatedField(
        many=True,
        slug_field="name",
        queryset=Technology.objects.all()
    )
    category = serializers.SlugRelatedField(
        slug_field="name",
        queryset=Category.objects.all()
    )
    
    url = serializers.HyperlinkedIdentityField(view_name='project-detail')
    
    class Meta:
        model = Project
        fields = (
            'url',
            'id', 
            'title', 
            'description', 
            'link', 
            'image', 
            'created_at',
            'category', 
            'technologies'
        )

    def to_internal_value(self, data):
        """
        OVERRIDE: This method runs BEFORE validation.
        It allows us to create missing Technologies on the fly.
        """
        if 'technologies' in data and isinstance(data['technologies'], list):
            for tech_name in data['technologies']:
                Technology.objects.get_or_create(name=tech_name)
        
        return super().to_internal_value(data)