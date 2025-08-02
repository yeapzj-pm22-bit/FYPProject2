import React, { useState } from 'react';
import { Search, CheckCircle, XCircle, Clock, Database, User, Hash, Calendar, AlertCircle, RefreshCw, Copy } from 'lucide-react';
import "./TEST.css";
const BlockchainRecordFinder = () => {
  const [searchType, setSearchType] = useState('blockId');
  const [searchTerm, setSearchTerm] = useState('block_5_bssa_1754143189552_nghg8p8nho_1754143189909');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lastSearched, setLastSearched] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);

  const searchTypes = {
    blockId: {
      label: 'Block ID',
      icon: <Hash className="w-4 h-4" />,
      placeholder: 'block_5_bssa_1754143189552_nghg8p8nho_1754143189909',
      endpoint: (term) => `/api/blockchain/verify/${encodeURIComponent(term)}`,
      method: 'GET'
    },
    sessionId: {
      label: 'Session ID',
      icon: <Database className="w-4 h-4" />,
      placeholder: 'bssa_1754143189552_nghg8p8nho',
      endpoint: () => '/api/blockchain/search',
      method: 'POST',
      body: (term) => ({ searchType: 'sessionId', searchTerm: term })
    },
    userId: {
      label: 'User ID',
      icon: <User className="w-4 h-4" />,
      placeholder: '51087c03c5dc328c2b4bb16bdbf22ed5',
      endpoint: () => '/api/blockchain/search',
      method: 'POST',
      body: (term) => ({ searchType: 'userId', searchTerm: term })
    },
    email: {
      label: 'Email',
      icon: <User className="w-4 h-4" />,
      placeholder: 'user@example.com',
      endpoint: () => '/api/blockchain/search',
      method: 'POST',
      body: (term) => ({ searchType: 'email', searchTerm: term })
    }
  };

  const findRecord = async () => {
    if (!searchTerm.trim()) {
      setResult({
        success: false,
        error: `Please enter a ${searchTypes[searchType].label}`
      });
      return;
    }

    setLoading(true);
    setResult(null);

    const searchConfig = searchTypes[searchType];
    const searchTime = new Date();

    try {
      const url = `http://localhost:8080${searchConfig.endpoint(searchTerm.trim())}`;

      const requestOptions = {
        method: searchConfig.method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (searchConfig.method === 'POST' && searchConfig.body) {
        requestOptions.body = JSON.stringify(searchConfig.body(searchTerm.trim()));
      }

      console.log('🔍 Searching:', { url, method: searchConfig.method, searchType, searchTerm });

      const response = await fetch(url, requestOptions);
      const data = await response.json();

      console.log('📊 Response:', data);

      // Process response based on search type
      let processedResult;

      if (searchType === 'blockId') {
        // Direct verification response
        processedResult = {
          success: response.ok,
          found: data.found || data.exists || data.verified,
          verified: data.verified,
          data: data,
          searchType,
          searchTerm: searchTerm.trim()
        };
      } else {
        // Search response
        processedResult = {
          success: response.ok && data.success,
          found: data.resultsCount > 0,
          results: data.results || [],
          resultsCount: data.resultsCount || 0,
          data: data,
          searchType,
          searchTerm: searchTerm.trim()
        };
      }

      if (!response.ok) {
        processedResult.error = `Server error (${response.status}): ${data.message || 'Unknown error'}`;
      }

      setResult(processedResult);
      setLastSearched(searchTime.toLocaleString());

      // Add to search history
      setSearchHistory(prev => [
        {
          type: searchType,
          term: searchTerm.trim(),
          found: processedResult.found,
          timestamp: searchTime
        },
        ...prev.slice(0, 4) // Keep last 5 searches
      ]);

    } catch (error) {
      console.error('❌ Search error:', error);
      setResult({
        success: false,
        found: false,
        error: 'Connection failed. Make sure your server is running on localhost:8080',
        searchType,
        searchTerm: searchTerm.trim()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      findRecord();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const quickSearch = (type, term) => {
    setSearchType(type);
    setSearchTerm(term);
    setTimeout(() => findRecord(), 100);
  };

  const getStatusIcon = () => {
    if (loading) return <Clock className="w-8 h-8 text-blue-500 animate-spin" />;
    if (result?.error) return <XCircle className="w-8 h-8 text-red-500" />;
    if (result?.found) return <CheckCircle className="w-8 h-8 text-green-500" />;
    if (result && !result.found) return <XCircle className="w-8 h-8 text-red-500" />;
    return <Search className="w-8 h-8 text-gray-400" />;
  };

  const getStatusText = () => {
    if (loading) return 'Searching...';
    if (result?.error) return 'Search Failed';
    if (result?.found) {
      if (searchType === 'blockId') return 'Record Found ✅';
      return `Found ${result.resultsCount} Record(s) ✅`;
    }
    if (result && !result.found) return 'No Records Found ❌';
    return 'Ready to Search';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔍 Blockchain Record Finder</h1>
          <p className="text-gray-600">Search and verify blockchain records by multiple criteria</p>
        </div>

        {/* Main Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">

          {/* Search Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Search By:
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(searchTypes).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSearchType(key)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                    searchType === key
                      ? 'bg-blue-100 border-blue-500 text-blue-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {config.icon}
                  <span className="font-medium">{config.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-4 pr-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                placeholder={searchTypes[searchType].placeholder}
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={findRecord}
            disabled={loading || !searchTerm.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg"
          >
            {loading ? (
              <>
                <Clock className="w-6 h-6 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-6 h-6" />
                Find Record
              </>
            )}
          </button>

          {/* Status Display */}
          <div className="mt-8 text-center">
            <div className="flex flex-col items-center gap-4">
              {getStatusIcon()}
              <div>
                <h2 className="text-2xl font-bold text-gray-700">
                  {getStatusText()}
                </h2>
                {lastSearched && (
                  <p className="text-sm text-gray-500 mt-1">
                    Last searched: {lastSearched}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            {result.found ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h3 className="text-2xl font-bold text-green-800">
                    {searchType === 'blockId' ? 'Record Found!' : `Found ${result.resultsCount} Record(s)!`}
                  </h3>
                </div>

                {/* Block ID Verification Results */}
                {searchType === 'blockId' && result.data && (
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">Verification Status</p>
                        <p className="font-bold text-lg text-green-600">
                          {result.data.verified ? 'Verified ✅' : 'Found but Unverified ⚠️'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">Provider</p>
                        <p className="font-bold text-lg text-green-600">
                          {result.data.provider || 'SIMULATION'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-gray-600">Network Status</p>
                        <p className="font-bold text-lg text-green-600">
                          {result.data.networkStatus || 'Active'}
                        </p>
                      </div>
                    </div>

                    {result.data.recordDetails && (
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3">📋 Record Details</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          {result.data.recordDetails.userId && (
                            <div>
                              <p className="text-gray-600">User ID</p>
                              <p className="font-mono text-xs bg-gray-100 p-1 rounded">
                                {result.data.recordDetails.userId}
                              </p>
                            </div>
                          )}
                          {result.data.recordDetails.registrationDate && (
                            <div>
                              <p className="text-gray-600">Registration</p>
                              <p className="text-gray-800">
                                {new Date(result.data.recordDetails.registrationDate).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                          <div>
                            <p className="text-gray-600">Corda Records</p>
                            <p className="text-gray-800">{result.data.recordDetails.cordaRecords || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">User Records</p>
                            <p className="text-gray-800">{result.data.recordDetails.userRecords || 0}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Results */}
                {searchType !== 'blockId' && result.results && (
                  <div className="space-y-4">
                    {result.results.map((record, index) => (
                      <div key={index} className="bg-green-50 rounded-xl p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">User ID</p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-xs bg-white p-2 rounded border">
                                {record.userId}
                              </p>
                              <button
                                onClick={() => copyToClipboard(record.userId)}
                                className="p-1 hover:bg-green-200 rounded"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-gray-800">{record.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Registration TX</p>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-xs bg-white p-2 rounded border max-w-32 truncate" title={record.registrationTxId}>
                                {record.registrationTxId}
                              </p>
                              <button
                                onClick={() => quickSearch('blockId', record.registrationTxId)}
                                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                              >
                                Verify
                              </button>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Created</p>
                            <p className="text-gray-800">{new Date(record.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Raw Data Toggle */}
                <details className="mt-6">
                  <summary className="cursor-pointer text-green-600 hover:text-green-800 font-medium">
                    View Raw Data
                  </summary>
                  <div className="mt-2 bg-gray-100 rounded-lg p-4">
                    <pre className="text-xs overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
                </details>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <XCircle className="w-6 h-6 text-red-600" />
                  <h3 className="text-2xl font-bold text-red-800">
                    {result.error ? 'Search Failed' : 'No Records Found'}
                  </h3>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <div className="space-y-3">
                    <p><strong>Search Type:</strong> {searchTypes[searchType].label}</p>
                    <p><strong>Search Term:</strong> <code className="bg-red-100 px-2 py-1 rounded">{result.searchTerm}</code></p>

                    {result.error ? (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-red-600"><strong>Error:</strong></p>
                        <p className="text-red-700">{result.error}</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-red-700 mb-2">No records found. Please check:</p>
                        <ul className="list-disc list-inside text-sm space-y-1 text-red-600">
                          <li>Search term is correct</li>
                          <li>Record exists in the database</li>
                          <li>Server is running on localhost:8080</li>
                          <li>Database connection is working</li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Search Options */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">🚀 Quick Search Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => quickSearch('blockId', 'block_5_bssa_1754143189552_nghg8p8nho_1754143189909')}
              className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-800">Your Registration Block</p>
              <p className="text-xs text-gray-600 font-mono mt-1">block_5_bssa_1754143189552_nghg8p8nho_1754143189909</p>
            </button>

            <button
              onClick={() => quickSearch('sessionId', 'bssa_1754143189552_nghg8p8nho')}
              className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-800">Your Session ID</p>
              <p className="text-xs text-gray-600 font-mono mt-1">bssa_1754143189552_nghg8p8nho</p>
            </button>

            <button
              onClick={() => quickSearch('userId', '51087c03c5dc328c2b4bb16bdbf22ed5')}
              className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-800">Your User ID</p>
              <p className="text-xs text-gray-600 font-mono mt-1">51087c03c5dc328c2b4bb16bdbf22ed5</p>
            </button>

            <button
              onClick={() => quickSearch('blockId', 'fake_nonexistent_block')}
              className="text-left bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <p className="font-medium text-gray-800">Test Non-Existent Record</p>
              <p className="text-xs text-gray-600 font-mono mt-1">fake_nonexistent_block</p>
            </button>
          </div>
        </div>

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="font-semibold text-gray-800 mb-4">📚 Recent Searches</h3>
            <div className="space-y-2">
              {searchHistory.map((search, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
                  onClick={() => quickSearch(search.type, search.term)}
                >
                  <div className="flex items-center gap-3">
                    {search.found ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                    <span className="font-medium">{searchTypes[search.type].label}:</span>
                    <code className="text-sm bg-white px-2 py-1 rounded">{search.term}</code>
                  </div>
                  <span className="text-xs text-gray-500">
                    {search.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Healthcare Blockchain Record Finder • Server: localhost:8080
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainRecordFinder;