import { useState, useEffect, useMemo } from 'react';
import { Trophy, Award, Medal, Search, ChevronLeft, ChevronRight, Star, Zap, Crown, Sparkles } from 'lucide-react';
import './App.css';

const GoogleSkillsBoostLeaderboard = () => {
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [filterBadges, setFilterBadges] = useState('all');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    const avatarColors = [
      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
      "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
      "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      "linear-gradient(135deg, #ff6e7f 0%, #bfe9ff 100%)"
    ];

    fetch('http://localhost:5000/api/students')
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        const processedData = data
          .sort((a, b) => b.badges - a.badges)
          .map((student, index) => {
            const nameParts = student.name.split(' ');
            const avatar = `${nameParts[0]?.[0] || ''}${nameParts[1]?.[0] || ''}`.toUpperCase();
            return {
              id: index + 1,
              name: student.name,
              badges: student.badges,
              avatar: avatar,
              color: avatarColors[index % avatarColors.length]
            };
          });
        setAllStudents(processedData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch student data:", err);
        setError("Failed to load leaderboard data. Please make sure the backend server is running.");
        setLoading(false);
      });
  }, []);

  const filteredStudents = useMemo(() => {
    let filtered = allStudents;
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterBadges !== 'all') {
      const min = parseInt(filterBadges);
      const max = min === 15 ? 20 : min + 4;
      filtered = filtered.filter(student => 
        student.badges >= min && student.badges <= max
      );
    }
    return filtered;
  }, [allStudents, searchTerm, filterBadges]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedStudents = filteredStudents.slice(startIndex, endIndex);

  const getProgressColor = (badges) => {
    const percentage = (badges / 20) * 100;
    if (percentage >= 75) return 'linear-gradient(90deg, #34A853 0%, #0F9D58 100%)';
    if (percentage >= 50) return 'linear-gradient(90deg, #FBBC05 0%, #F9AB00 100%)';
    return 'linear-gradient(90deg, #EA4335 0%, #D93025 100%)';
  };
  
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const topThree = allStudents.slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Loading Leaderboard...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-3xl p-10 shadow-2xl border-4 border-red-300 max-w-2xl">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-2xl font-bold text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 lg:px-8">
      <div className="w-full max-w-[1920px] mx-auto absolute">
        {/* Animated Header */}
        <div className="text-center mb-8 lg:mb-12 relative m-10">
          <div className="relative">
            <div className="inline-flex items-center gap-2 lg:gap-2 bg-white rounded-full  py-3 lg:px-12 lg:py-4 shadow-xl border-4 border-blue-100 mb-4 lg:mb-6 animate-fade-in">
              <img src="NewGDG.png" alt="GDG" className="w-12 h-12 lg:w-16 lg:h-16" />
              <div className="text-left">
                <h1 className="text-xl lg:text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ">
                  Google Developer Group
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 font-semibold">Official Leaderboard</p>
              </div>
            </div>
            <h2 className="text-3xl lg:text-5xl font-black mb-2 lg:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in-up">
              Cloud Skills Boost Challenge
            </h2>
            <p className="text-base lg:text-xl text-gray-600 font-medium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Compete • Learn • Achieve • Excel 🏆</p>
            <p className="text-base lg:text-xl text-white font-medium animate-fade-in-up">.</p>
          </div>
        </div>

        {/* Epic Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="mb-12 lg:mb-16 relative pt-20">
            <div className="relative inset-0 bg-gradient-to-r from-yellow-200 via-pink-200 to-blue-200 opacity-30 blur-3xl"></div>
            <div className="relative grid grid-cols-3 gap-3 lg:gap-6 md:max-w-[1920px] mx-auto items-end">
              {/* 2nd Place */}
              <div
  className="transform hover:scale-105 transition-all duration-300 animate-slide-up"
  style={{ animationDelay: '0.1s' }}
>
  <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-2xl border-2 lg:border-4 border-gray-300 relative overflow-visible">
    <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-gray-200 to-gray-400 opacity-20 rounded-full -mr-10 lg:-mr-16 -mt-10 lg:-mt-16"></div>

    {/* Centered content */}
    <div className="relative flex flex-col items-center justify-center text-center">
      {/* Medal floating just above avatar */}
      <div className="absolute -top-8 flex flex-col items-center z-10">
        <div className="relative">
          <Medal className="w-10 h-10 lg:w-16 lg:h-16 text-gray-400 drop-shadow-lg" />
          <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-white rounded-full p-0.5 lg:p-1 shadow-lg">
            <Star className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 fill-gray-400" />
          </div>
        </div>
      </div>

      {/* Centered avatar */}
      <div
        className="w-16 h-16 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-black text-xl lg:text-3xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform mt-10 relative z-0"
        style={{ background: topThree[1]?.color }}
      >
        {topThree[1]?.avatar}
      </div>

      {/* Name & badges below */}
      <h3 className="font-bold text-sm lg:text-xl text-gray-800 mt-3 lg:mt-5 mb-1 lg:mb-2 truncate px-1">
        {topThree[1]?.name}
      </h3>

      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full px-3 lg:px-6 py-2 lg:py-3 inline-block mt-2">
        <div className="text-2xl lg:text-4xl font-black text-gray-600">
          {topThree[1]?.badges}
        </div>
        <div className="text-xs lg:text-sm font-bold text-gray-500">BADGES</div>
      </div>
    </div>
  </div>
</div>


              {/* 1st Place - Champion */}
              <div className="transform hover:scale-110 transition-all duration-300 -translate-y-4 lg:-translate-y-8 animate-slide-up">
                <div className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-10 shadow-2xl border-2 lg:border-4 border-yellow-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 opacity-50"></div>
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-2 left-2 lg:top-4 lg:left-4 w-2 h-2 lg:w-3 lg:h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    <div className="absolute top-3 right-3 lg:top-6 lg:right-6 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-orange-400 rounded-full animate-ping"></div>
                    <div className="absolute bottom-4 left-4 lg:bottom-8 lg:left-8 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-400 rounded-full animate-ping"></div>
                  </div>
                  <div className="relative flex flex-col items-center justify-center text-center">
                      {/* Crown above */}
                <div className="absolute top-5 md:top-10 flex flex-col items-center">
                  <Crown className="w-12 h-12 lg:w-20 lg:h-20 text-yellow-500 drop-shadow-2xl animate-bounce" />
                  <div className="absolute inset-0 bg-yellow-300 blur-xl opacity-50 animate-pulse"></div>
                </div>

                {/* Center avatar */}
                <div
                  className="w-20 h-20 lg:w-32 lg:h-32 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white font-black text-2xl lg:text-4xl shadow-2xl transform hover:rotate-12 transition-transform ring-4 lg:ring-8 ring-yellow-200"
                  style={{ background: topThree[0]?.color }}
                >
                  {topThree[0]?.avatar}
                </div>

                {/* Name and badges below */}
                <h3 className="font-black text-base lg:text-2xl text-gray-800 mt-3 lg:mt-5 truncate px-1">
                  {topThree[0]?.name}
                </h3>
                <div className="bg-gradient-to-r from-yellow-100 to-yellow-100 rounded-full px-4 lg:px-8 py-2 lg:py-4 inline-block shadow-xl mt-2">
                  <div className="text-3xl lg:text-5xl font-black text-yellow-500 drop-shadow-lg">{topThree[0]?.badges}</div>
                  <div className="text-xs lg:text-sm font-black text-yellow-400">BADGES</div>
                </div>
              </div>
              </div>
            </div>

              {/* 3rd Place */}
                <div
  className="transform hover:scale-105 transition-all duration-300 animate-slide-up"
  style={{ animationDelay: '0.2s' }}
>
  <div className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-8 shadow-2xl border-2 lg:border-4 border-orange-300 relative overflow-visible">
    <div className="absolute top-0 right-0 w-20 h-20 lg:w-32 lg:h-32 bg-gradient-to-br from-orange-200 to-red-400 opacity-20 rounded-full -mr-10 lg:-mr-16 -mt-10 lg:-mt-16"></div>

    {/* Centered layout */}
    <div className="relative flex flex-col items-center justify-center text-center">
      {/* Medal floating above avatar */}
      <div className="absolute -top-7 flex flex-col items-center z-10">
        <div className="relative">
          <Medal className="w-8 h-8 lg:w-14 lg:h-14 text-orange-500 drop-shadow-lg" />
          <div className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-white rounded-full p-0.5 lg:p-1 shadow-lg">
            <Star className="w-3 h-3 lg:w-4 lg:h-4 text-orange-500 fill-orange-500" />
          </div>
        </div>
      </div>

      {/* Centered avatar */}
      <div
        className="w-14 h-14 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-black text-lg lg:text-2xl shadow-xl transform -rotate-3 hover:rotate-0 transition-transform mt-8 relative z-0"
        style={{ background: topThree[2]?.color }}
      >
        {topThree[2]?.avatar}
      </div>

      {/* Name & badges below */}
      <h3 className="font-bold text-sm lg:text-lg text-gray-800 mt-3 lg:mt-5 mb-1 lg:mb-2 truncate px-1">
        {topThree[2]?.name}
      </h3>

      <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-full px-3 lg:px-6 py-2 lg:py-3 inline-block mt-2">
        <div className="text-xl lg:text-3xl font-black text-orange-600">
          {topThree[2]?.badges}
        </div>
        <div className="text-xs lg:text-sm font-bold text-orange-500">
          BADGES
        </div>
      </div>
    </div>
  </div>
</div>

            </div>
          </div>
        )}
                    <p className="text-base lg:text-xl text-white font-medium animate-fade-in-up">.</p>
        {/* Colorful Stats Cards */}

        <div className=" mt-24 lg:mt-32 grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600  lg:p-6 shadow-xl text-white transform hover:scale-105 transition-all animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-1 lg:mb-2">
              <Zap className="w-6 h-6 lg:w-8 lg:h-8" />
              <div className="text-2xl lg:text-4xl font-black">{allStudents.length}</div>
            </div>
            <div className="text-xs lg:text-sm font-bold opacity-90">Total Participants</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600  p-4 lg:p-6 shadow-xl text-white transform hover:scale-105 transition-all animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center justify-between mb-1 lg:mb-2">
              <Award className="w-6 h-6 lg:w-8 lg:h-8" />
              <div className="text-2xl lg:text-4xl font-black">
                {allStudents.length > 0 ? Math.round(allStudents.reduce((sum, s) => sum + s.badges, 0) / allStudents.length) : 0}
              </div>
            </div>
            <div className="text-xs lg:text-sm font-bold opacity-90">Average Badges</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500  p-4 lg:p-6 shadow-xl text-white transform hover:scale-105 transition-all animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center justify-between mb-1 lg:mb-2">
              <Trophy className="w-6 h-6 lg:w-8 lg:h-8" />
              <div className="text-2xl lg:text-4xl font-black">{allStudents[0]?.badges || 0}</div>
            </div>
            <div className="text-xs lg:text-sm font-bold opacity-90">Highest Score</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500  p-4 lg:p-6 shadow-xl text-white transform hover:scale-105 transition-all animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-between mb-1 lg:mb-2">
              <Star className="w-6 h-6 lg:w-8 lg:h-8 fill-white" />
              <div className="text-2xl lg:text-4xl font-black">
                {allStudents.filter(s => s.badges === 20).length}
              </div>
            </div>
            <div className="text-xs lg:text-sm font-bold opacity-90">Perfect Scores</div>
          </div>
        </div>
                    <p className="text-base lg:text-xl text-white font-medium animate-fade-in-up">.</p>
        {/* Search and Filter */}
        <div
  className="bg-white rounded-2xl p-6 lg:p-8 shadow-xl mb-8 border-2 border-purple-100 animate-fade-in-up"
  style={{ animationDelay: '0.7s' }}
>
  <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
    <div className="flex-1 relative group">
      <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 lg:w-7 lg:h-7 group-focus-within:text-blue-500 transition-colors" />
      <input
        type="text"
        placeholder="       Search student by name..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full pl-12 lg:pl-16 pr-4 lg:pr-6 py-3 lg:py-6 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:border-blue-500 text-gray-800 font-medium lg:font-semibold text-base lg:text-xl transition-all"
      />
    </div>

    <select
      value={filterBadges}
      onChange={(e) => {
        setFilterBadges(e.target.value);
        setCurrentPage(1);
      }}
      className="px-6 lg:px-8 py-3 lg:py-6 border-2 border-gray-200 rounded-xl lg:rounded-2xl focus:outline-none focus:border-purple-500 text-gray-800 font-semibold bg-white cursor-pointer transition-all text-base lg:text-xl"
    >
      <option value="all">🎯 All Badges</option>
      <option value="15">⭐ 15-20 Badges</option>
      <option value="10">🔥 10-14 Badges</option>
      <option value="5">💪 5-9 Badges</option>
      <option value="1">🚀 1-4 Badges</option>
    </select>
  </div>
</div>


                    <p className="text-base lg:text-xl text-white font-medium animate-fade-in-up">.</p>
        {/* Leaderboard Cards */}
        <div className="space-y-4 mb-8">
          {displayedStudents.map((student, index) => {
            const actualRank = allStudents.findIndex(s => s.id === student.id) + 1;
            const percentage = (student.badges / 20) * 100;
            
            return (
              <div
                key={student.id}
                onMouseEnter={() => setHoveredRow(student.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 animate-slide-up ${
                  hoveredRow === student.id 
                    ? 'border-purple-400 shadow-2xl transform -translate-y-1' 
                    : 'border-gray-100 hover:border-purple-200'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3 lg:gap-6">
                  {/* Rank Badge */}
                  <div className="flex items-center gap-2 lg:gap-3">
                    <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center font-black text-base lg:text-xl shadow-lg transition-transform ${
                      hoveredRow === student.id ? 'scale-110' : ''
                    } ${
                      actualRank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' :
                      actualRank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400 text-white' :
                      actualRank === 3 ? 'bg-gradient-to-br from-orange-400 to-red-400 text-white' :
                      'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-700'
                    }`}>
                      #{actualRank}
                    </div>
                    {actualRank <= 3 && (
                      <div className="animate-bounce hidden lg:block">
                        {actualRank === 1 && <Crown className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />}
                        {actualRank === 2 && <Medal className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />}
                        {actualRank === 3 && <Medal className="w-5 h-5 lg:w-6 lg:h-6 text-orange-500" />}
                      </div>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-black text-base lg:text-xl shadow-xl transform transition-all duration-300 ${
                    hoveredRow === student.id ? 'scale-110 rotate-6' : ''
                  }`}
                    style={{ background: student.color }}>
                    {student.avatar}
                  </div>

                  {/* Student Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base lg:text-xl font-bold text-gray-800 mb-2 lg:mb-3 truncate">{student.name}</h3>
                    <div className="relative">
                      <div className="h-6 lg:h-8 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                        <div
                          className="h-full rounded-full transition-all duration-700 shadow-lg"
                          style={{
                            width: `${percentage}%`,
                            background: getProgressColor(student.badges)
                          }}
                        />
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="text-xs font-black text-gray-700 bg-transparent px-2 lg:px-3 py-0.5 lg:py-1 rounded-full shadow-md">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badge Counter */}
                  <div className="text-center">
                    <div className={`w-16 h-16 lg:w-24 lg:h-24 rounded-xl lg:rounded-2xl flex flex-col items-center justify-center shadow-xl transform transition-all duration-300 ${
                      hoveredRow === student.id ? 'scale-110' : ''
                    }`}
                      style={{ background: getProgressColor(student.badges) }}>
                      <div className="text-xl lg:text-3xl font-black text-white">{student.badges}</div>
                      <div className="text-xs font-bold text-white opacity-90">/ 20</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
                            <p className="text-base lg:text-xl text-white font-medium animate-fade-in-up">.</p>                           
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-row justify-center items-center gap-3 lg:gap-4 animate-fade-in ">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className=" w-1/3 h-15 sm:w-auto px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center text-xl md:w-full md:text-2xl"
            >
              <ChevronLeft className="w-8 h-10 md:w-14 lg:h-18" />
              Previous
            </button>
            <div className="px-6 lg:px-8 py-2 bg-white shadow-lg md:w-1/4 md:flex md:justify-center rounded-xl md:items-center">
              <span className="font-bold text-gray-800 text-lg  md:text-3xl" >
                Page <span className="text-purple-600">{currentPage}</span> of <span className="text-purple-600">{totalPages}</span>
              </span>
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-1/3 h-15 sm:w-auto px-4 lg:px-6 py-2  bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center text-xl  md:w-full md:text-2xl"
            >
              Next
              <ChevronRight className="w-8 h-10 md:w-14 lg:h-18" />
            </button>
          </div>
        )}
                            <p className="text-base lg:text-xl text-white font-medium animate-fade-in-up">.</p>
                            
      </div>
    </div>
  );
};

export default GoogleSkillsBoostLeaderboard;