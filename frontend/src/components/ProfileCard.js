// ProfileCard.js
import React from 'react';
import BottomNavBar from './BottomNavBar';

const ProfileCard = () => {
    return (
        <div >
            <div className="max-w-screen-sm mx-auto  rounded-lg shadow-lg overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
                {/* Background Image */}
                <div className="relative">
                    <div
                        className="h-40 bg-cover bg-center rounded-t-lg"
                        style={{ backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOTh9LHprIneQWgTckln-omCMRJ51YN9xMXg&s)' }}
                    >
                        {/* Profile Image */}
                        <div className="absolute -bottom-10 left-4">
                            <img
                                className="w-24 h-24 rounded-full border-4 border-white"
                                src="https://randomuser.me/api/portraits/men/75.jpg"
                                alt="Profile"
                            />
                        </div>
                    </div>
                </div>

                {/* User Info */}
                <div className="mt-12 ">
                    <h2 className="text-5xl text-center font-semibold">John Doe</h2>
                    <p className="mt-2 text-gray-100"><strong>10</strong> Friends</p>
                    <div className='flex cursor-pointer text-gray-950 text-2xl font-serif bg-violet-500  hover:bg-violet-600 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-30'>
                        <h2 className='flex-auto  hover:underline'> About </h2> <h2 className='flex-auto hover:underline'>Friends</h2> <h2 className='flex-auto hover:underline'>CommonFriends</h2>
                    </div>


                    <div className="mt-4 space-y-2">
                        <p>Friends: <strong>10</strong></p>
                        <p>Hobbies: <strong>Reading, Gaming</strong></p>
                        <p>Skills: <strong>Coding, Web Development</strong></p>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-2xl font-bold">Actions</h3>
                        <ul className="mt-2">
                            <li className="items-center space-x-2">
                                <span className="text-lg font-bold">Title 1 :</span>

                                <img
                                    className="w-40 h-40  flex-row"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOTh9LHprIneQWgTckln-omCMRJ51YN9xMXg&s"
                                    alt="Profile"
                                />
                                <span>Message of the day</span>

                            </li>

                            <li className="flex items-center space-x-2">
                                <span className="text-lg font-bold">Title 2 :</span>
                                <span>Message of the day</span>
                            </li>
                        </ul>
                    </div>

                    {/* Friends List */}
                    <div className="mt-6">
                        <h3 className="text-2xl font-bold">Friends List</h3>
                        <ul className="mt-2">
                            <li className="flex items-center space-x-2">
                                <span className="text-lg">👤</span>
                                <span>Friend 1</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <span className="text-lg">👤</span>
                                <span>Friend 2</span>
                            </li>
                        </ul>
                    </div>

                    {/* Search Button */}
                    <button className="mt-6 px-4 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 ease-in-out transform hover:scale-105">
                        Search New Friends
                    </button>

                </div>
                <div>

                </div>
            </div>
            {/* <div className="max-w-screen-sm  mx-auto my-4 rounded-lg shadow-lg overflow-hidden relative ">
                <BottomNavBar  />
            </div> */}
            <BottomNavBar />

        </div>
    );
};

export default ProfileCard;
