import Layout from "./components/Layout";
import ProjectCard from "./components/ProjectCard";
import ProjectForm from "./components/ProjectForm";
import useProjects from "./hooks/useProjects";
import "./App.css";

function App() {
  const { projects, isLoading, error, refresh } = useProjects();

  // We removed the early "return" statements.
  // Now we always render the Layout and Form, so the success message won't disappear!

  return (
    <Layout>
      {/* 1. Form is always visible, even while loading */}
      <ProjectForm onProjectAdded={refresh} />

      <hr style={{ margin: "40px 0" }} />

      <h2>Project List</h2>

      {/* 2. Error Message Area (Updated Text) */}
      {error && (
        <div
          style={{
            color: "red",
            background: "#fee",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
          }}
        >
          <h3>⚠️ Connection Failed</h3>
          <p>{error}</p>
          <p>
            <strong>Note:</strong> If this is the first time loading in a while,
            the Render backend might be "waking up." Please wait 60 seconds and
            click Refresh.
          </p>
        </div>
      )}

      {/* 3. Loading State (Only replaces the list, not the whole page) */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <h2>🌀 Loading data...</h2>
        </div>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 4. Manual Refresh Button */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={refresh} className="btn-refresh">
          🔄 Refresh Data
        </button>
      </div>
    </Layout>
  );
}

export default App;
