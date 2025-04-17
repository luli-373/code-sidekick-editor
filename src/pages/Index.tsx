
import { Link } from "react-router-dom";
import { Code } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Code Editor App</h1>
        <p className="text-xl text-gray-600 mb-8">Edit your files with our powerful code editor</p>
        
        <Link 
          to="/editor" 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          <Code size={20} />
          Open Editor
        </Link>
      </div>
    </div>
  );
};

export default Index;
