import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

interface ProjectImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  order: number;
}

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string | null;
  websiteUrl: string | null;
  technologies: string[];
  aiPrompt: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  featured: boolean;
  order: number;
  images?: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<ProjectImage[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    websiteUrl: '',
    technologies: '',
    aiPrompt: '',
    status: 'COMPLETED' as 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD',
    featured: false,
    order: '0',
  });

  useEffect(() => {
    checkAuth();
    fetchProjects();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.href = '/#/admin/login';
    }
  };

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Failed to fetch projects');
      }
    } catch (err) {
      setError('An error occurred while fetching projects');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/#/admin/login';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }

      const response = await fetch('/api/admin/upload/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      console.log('Upload response:', data);
      if (data.success) {
        const newImages = data.data.map((img: any, index: number) => ({
          id: `temp-${Date.now()}-${index}`,
          imageUrl: img.url,
          isPrimary: uploadedImages.length === 0 && index === 0,
          order: uploadedImages.length + index,
        }));
        console.log('New images:', newImages);
        setUploadedImages([...uploadedImages, ...newImages]);
      } else {
        setError(data.message || 'Failed to upload images');
      }
    } catch (err) {
      setError('An error occurred while uploading images');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSetPrimaryImage = (imageId: string) => {
    const newImages = uploadedImages.map(img => ({
      ...img,
      isPrimary: img.id === imageId
    }));
    setUploadedImages(newImages);
  };

  const handleRemoveImage = (imageId: string) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== imageId));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      description: '',
      websiteUrl: '',
      technologies: '',
      aiPrompt: '',
      status: 'COMPLETED',
      featured: false,
      order: '0',
    });
    setUploadedImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const url = editingProject
        ? `/api/admin/projects/${editingProject.id}`
        : '/api/admin/projects';

      const method = editingProject ? 'PUT' : 'POST';

      const submitData = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        websiteUrl: formData.websiteUrl || null,
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        aiPrompt: formData.aiPrompt || null,
        status: formData.status,
        featured: formData.featured,
        order: parseInt(formData.order),
        images: uploadedImages.map((img, index) => ({
          url: img.imageUrl,
          isPrimary: img.isPrimary,
          order: index
        }))
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
        setShowAddForm(false);
        setEditingProject(null);
        resetForm();
      } else {
        setError(data.message || 'Failed to save project');
      }
    } catch (err) {
      setError('An error occurred while saving project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      websiteUrl: project.websiteUrl || '',
      technologies: project.technologies.join(', '),
      aiPrompt: project.aiPrompt || '',
      status: project.status,
      featured: project.featured,
      order: project.order.toString(),
    });
    setUploadedImages(project.images || []);
    setShowAddForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('An error occurred while deleting project');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD') => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/projects/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
      } else {
        setError('Failed to update project status');
      }
    } catch (err) {
      setError('An error occurred while updating project status');
    }
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/projects/${id}/featured`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ featured }),
      });

      const data = await response.json();
      if (data.success) {
        await fetchProjects();
      } else {
        setError('Failed to update featured status');
      }
    } catch (err) {
      setError('An error occurred while updating featured status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                + Add Project
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add/Edit Project Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    placeholder="e.g., Web Development, Mobile App"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website URL
                  </label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={formData.technologies}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    placeholder="React, Node.js, TypeScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    required
                  >
                    <option value="COMPLETED">Completed</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    AI Prompt (for mockup generation)
                  </label>
                  <textarea
                    name="aiPrompt"
                    value={formData.aiPrompt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                    placeholder="Describe the image you want to generate..."
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Featured Project
                  </label>
                </div>
              </div>

              {/* Image Upload */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingImage && (
                    <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                  )}
                </div>

                {/* Image Preview */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {uploadedImages.map((image) => {
                      console.log('Rendering image:', image.id, 'URL:', image.imageUrl);
                      return (
                      <div key={image.id} className="relative">
                        {image.imageUrl ? (
                          <img
                            src={image.imageUrl}
                            alt="Project"
                            className={`w-full h-24 object-cover rounded-lg border-2 ${
                              image.isPrimary ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-300'
                            }`}
                            onLoad={() => console.log('Image loaded successfully:', image.imageUrl)}
                            onError={(e) => {
                              console.error('Image failed to load:', image.imageUrl);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-24 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No image URL</span>
                          </div>
                        )}
                        <div className="absolute top-1 right-1 flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryImage(image.id)}
                            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
                          >
                            Primary
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(image.id)}
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </div>
                        {image.isPrimary && (
                          <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Primary
                          </span>
                        )}
                      </div>
                    );
                    })}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProject(null);
                    resetForm();
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.imageUrl && (
                        <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-200 mr-3">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.error('Project thumbnail failed to load:', project.imageUrl);
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.technologies.slice(0, 3).join(', ')}
                          {project.technologies.length > 3 && '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={project.status}
                      onChange={(e) => handleStatusChange(project.id, e.target.value as any)}
                      className={`text-sm font-medium px-3 py-1 rounded-full border-0 ${getStatusColor(project.status)}`}
                    >
                      <option value="COMPLETED">Completed</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ON_HOLD">On Hold</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleFeatured(project.id, !project.featured)}
                      className={`text-2xl transition ${
                        project.featured ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {projects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No projects yet. Click "Add Project" to create your first project.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
