import React, { useState, useRef, useEffect } from 'react';
import { Search, X ,SendHorizontal,Settings2} from 'lucide-react';
//create CeacherDashboard same as StudentDashboard
const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchedStudents, setMatchedStudents] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Simulated search results
    setMatchedStudents(['Student 1', 'Student 2']);
    setIsDropdownOpen(true);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-200 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

      <div className="mb-6 relative " ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search student name"
            className="w-full p-2 pr-10 border rounded-lg"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <Settings2/>
          <SendHorizontal  className="absolute right-10 top-2.5 text-gray-400"/>
          <Search className="absolute right-3 top-2.5 text-gray-400" />
        </div>
        {isDropdownOpen && matchedStudents.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-gray-100 border rounded-lg shadow-lg">
            <div className="flex justify-between items-center p-2 border-b">
              <h4 className="font-semibold">Matched Students</h4>
              <X
                className="cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setIsDropdownOpen(false)}
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {matchedStudents.map((student, index) => (
                <li key={index} className="p-2 hover:bg-gray-200 cursor-pointer">{student}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex mb-6">
        <div className="w-1/3 pr-4">
          <div className="border-2 border-gray-300 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center text-gray-400">
            Photo
          </div>
          <h2 className="text-xl font-semibold mb-2">Name</h2>
          <p className="text-gray-600 mb-4">Contact details</p>
        </div>

        <div className="w-2/3">
          <h3 className="text-lg font-semibold mb-2">Courses</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Course</th>
                <th className="border p-2">Grade</th>
                <th className="border p-2">Attendance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Course 1</td>
                <td className="border p-2">A</td>
                <td className="border p-2">90%</td>
              </tr>
              <tr>
                <td className="border p-2">Course 2</td>
                <td className="border p-2">B</td>
                <td className="border p-2">80%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div> 
        <h3 className="text-lg font-semibold mb-2">Faculties List</h3>
        <div className=' flex overflow-x-auto whitespace-nowrap gap-4 '>
        <div className=" flex-none w-max h-36 bg-gray-300 border-l-teal-800   border-2 rounded-lg p-4">
          <h1>Name:Manosh<br></br>Phone:1234567890<br></br>Skills:Python,Java,C,C++,C#,JavaScript</h1>
        </div>
        <div className="flex-none w-max h-36 bg-gray-300 border-l-teal-800   border-2 rounded-lg p-4">
          <h1>Name:Manosh<br></br>Phone:1234567890<br></br>Skills:Python,Java,C,C++,C#,JavaScript</h1>
        </div>
        <div className="flex-none w-max h-36 bg-gray-300 border-l-teal-800   border-2 rounded-lg p-4">
          <h1>Name:Manosh<br></br>Phone:1234567890<br></br>Skills:Python,Java,C,C++,C#,JavaScript</h1>
        </div>
        <div className="flex-none w-max h-36 bg-gray-300 border-l-teal-800   border-2 rounded-lg p-4">
          <h1>Name:Manosh<br></br>Phone:1234567890<br></br>Skills:Python,Java,C,C++,C#,JavaScript</h1>
        </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;