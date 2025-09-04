import { useParams } from "react-router-dom";

const JobDetails = () => {
  const { id } = useParams();

  // Later: fetch job details by ID
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Job Details</h2>
      <p>Showing details for Job ID: {id}</p>
      <p className="mt-2">[Here you can show description, salary, etc.]</p>
    </div>
  );
};

export default JobDetails;
