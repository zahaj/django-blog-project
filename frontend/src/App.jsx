import Layout from "./components/Layout";
import ProjectCard from "./components/ProjectCard";
import ProjectForm from "./components/ProjectForm";
import useProjects from "./hooks/useProjects";
import "./App.css";

function App() {
  const { projects, isLoading, error, refresh } = useProjects();

  // --- Render Logic ---

  if (isLoading) {
    return (
      <Layout>
        <h2>🌀 Loading projects...</h2>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <h2 style={{ color: "red" }}>⚠️ Error loading portfolio</h2>
        <p>{error}</p>
        <p>
          Is your Docker backend running locally, or is the Netlify CORS block
          still active?
        </p>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* 1. Add the Form Component */}
      <ProjectForm onProjectAdded={refresh} />

      <hr style={{ margin: "40px 0" }} />

      {/* 2. Display the Projects */}
      <h2>Project List ({projects.length})</h2>
      <div className="project-list">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {/* 3. The Refresh Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={refresh} className="btn-refresh">
          🔄 Manually Refresh Data
        </button>
      </div>
    </Layout>
  );
}

export default App;
