"""
Views for the 'projects' app.

This file contains the "business logic" that handles web requests
and returns responses. It includes:

Function-Based Views (FBVs) for simple, read-only pages (e.g., index, about).

Class-Based Views (CBVs) for handling complex, model-based
CRUD (Create, Read, Update, Delete) operations for Projects.
"""
from django.shortcuts import render, get_object_or_404, redirect
from django.core.mail import send_mail
from .models import Project, Technology, Category
from .forms import ContactForm, ProjectForm
from django.views.generic import CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin
from django.conf import settings
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser, IsAuthenticatedOrReadOnly, AllowAny
from .serializers import ProjectSerializer, TechnologySerializer

def project_index(request):
    """
    Renders the homepage with a list of all Project objects.

    Template: 'projects/project_index.html'
    Context: {'projects': All Project objects}
    """
    projects = Project.objects.all()
    
    context = {
        'projects': projects
    }
    return render(request, 'projects/project_index.html', context)

def about(request):
    return render(request, 'projects/about.html')

def project_detail(request, pk):
    """
    Renders the detail page for a single project, identified by its 
    primary key (pk). Returns a 404 if the project is not found.

    Template: 'projects/project_detail.html'
    Context: {'project': The requested Project object}
    """
    project = get_object_or_404(Project, pk=pk)
    context = {
        'project': project
    }
    return render(request, 'projects/project_detail.html', context)

def technology_detail(request, name):
    """
    Displays a detail page for a single Technology.

    Fetches a Technology by its 'name' (case-insensitive) and 
    retrieves all associated projects via a reverse lookup.
    Returns a 404 if the technology is not found.

    Template: 'projects/technology_detail.html'
    Context: {
        'technology': The requested Technology object,
        'projects': A QuerySet of all projects linked to this technology
    }
    """
    technology = get_object_or_404(Technology, name=name)
    projects = technology.project_set.all()
    context = {
        'technology': technology,
        'projects': projects
    }
    return render(request, 'projects/technology_detail.html', context)

def contact(request):
    """
    Handles the contact form.
    - GET: Displays a blank ContactForm.
    - POST: Validates form. If valid, sends email and redirects to 
            'project_index'. If invalid, re-renders form with errors.
            
    Template: 'projects/contact.html'
    Context: {'form': ContactForm instance}
    """
    if request.method == 'POST':
        form = ContactForm(request.POST)
        
        if form.is_valid():
            name = form.cleaned_data['name']
            email = form.cleaned_data['email']
            message = form.cleaned_data['message']
            subject_line = form.cleaned_data['subject']
            
            subject = f"Portfolio Contact: {subject_line}"
            email_message = f"""
            You received a new message from your portfolio site:

            From: {name}
            Email: {email}
            Subject: {subject_line}

            Message:
            {message}
            """
            send_mail(
                subject,
                email_message,
                settings.DEFAULT_FROM_EMAIL,
                [settings.ADMIN_EMAIL],
            )

            print(f'New Message from {name} ({email}): {message}')
            return redirect('projects:project_index')
        else:
            print("Form invalid!")
            print(form.errors.as_data())
    else:
        form = ContactForm()
        
    context = {
        'form': form
    }
    return render(request, 'projects/contact.html', context)

class ProjectCreateView(LoginRequiredMixin, CreateView):
    model = Project
    form_class = ProjectForm
    template_name = 'projects/project_form.html'
    success_url = reverse_lazy('projects:project_index') # Where to go after success

class ProjectUpdateView(LoginRequiredMixin, UpdateView):
    model = Project
    form_class = ProjectForm
    template_name = 'projects/project_form.html'
    success_url = reverse_lazy('projects:project_index')

class ProjectDeleteView(LoginRequiredMixin, DeleteView):
    model = Project
    template_name = 'projects/project_confirm_delete.html'
    success_url = reverse_lazy('projects:project_index')

# --- ViewSet for API ---

class ProjectViewSet(viewsets.ModelViewSet):
    """
    A read-write API endpoint for projects.
    - Read operations (list, retrieve) are public.
    - Write operations (create, update, destroy) are restricted to admins.
    """
    queryset = Project.objects.select_related('category').prefetch_related('technologies').all().order_by('-created_at')
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class TechnologyViewSet(viewsets.ModelViewSet):
    """
    A read-write API endpoint for technologies.
    Restricted to admin users only.
    """
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]