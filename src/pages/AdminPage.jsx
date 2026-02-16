import axios from "axios";
import { useState, useEffect } from "react";

function AdminPage() {
    const API = import.meta.env.VITE_API_URL;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifyingId, setVerifyingId] = useState(null);
    const [activeTab, setActiveTab] = useState("other"); // "other" or "kare"

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "Sparkz2K26") {
            setIsAuthenticated(true);
        } else {
            alert("Invalid Password");
        }
    };


    useEffect(() => {
        if (isAuthenticated) {
            axios.get(`${API}/admin/users`)
                .then(res => {
                    setUsers(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err);
                    setLoading(false);
                });
        }
    }, [isAuthenticated]);

    const verifyUser = async (id) => {
        try {
            setVerifyingId(id);
            await axios.post(`${API}/user/verify/${id}`);

            setUsers(prev =>
                prev.map(user =>
                    user._id === id
                        ? { ...user, verified: true }
                        : user
                )
            );
        } catch (err) {
            alert("Verification failed");
        } finally {
            setVerifyingId(null);
        }
    };
    if (!isAuthenticated) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-black text-white">
                <h1 className="text-3xl font-bold mb-6 text-red-500">Admin Access</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 rounded bg-gray-800 border border-gray-700 text-white outline-none focus:border-red-500"
                    />
                    <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                    >
                        Enter
                    </button>
                </form>
            </div>
        );
    }
    if (loading)
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white text-xl">
                Loading users...
            </div>
        );

    if (error)
        return (
            <div className="flex justify-center items-center h-screen bg-black text-red-500 text-xl">
                Error: {error.message}
            </div>
        );



    const kareStudents = users.filter(user => user.email.includes("@klu.ac.in"));
    const otherStudents = users.filter(user => !user.email.includes("@klu.ac.in"));

    const displayedUsers = activeTab === "kare" ? kareStudents : otherStudents;

    return (
        <div className="min-h-screen bg-black text-white p-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-4xl font-bold text-red-500 mb-4 md:mb-0">
                    Admin Dashboard
                </h1>

                {/* Tabs */}
                <div className="flex bg-gray-900 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab("other")}
                        className={`px-4 py-2 rounded-md transition ${activeTab === "other"
                            ? "bg-red-600 text-white font-bold"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Other Students ({otherStudents.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("kare")}
                        className={`px-4 py-2 rounded-md transition ${activeTab === "kare"
                            ? "bg-red-600 text-white font-bold"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        KARE Students ({kareStudents.length})
                    </button>
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {displayedUsers.map((user, index) => (

                    <div
                        key={user._id}
                        className="bg-[#111] border border-gray-800 rounded-xl p-5 shadow-lg hover:shadow-red-500/20 transition"
                    >

                        {/* User Header */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-semibold">
                                {index + 1}. {user.name}
                            </h2>

                            {user.verified ? (
                                <span className="bg-green-600 text-xs px-2 py-1 rounded">
                                    Verified
                                </span>
                            ) : (
                                <span className="bg-yellow-600 text-xs px-2 py-1 rounded">
                                    Pending
                                </span>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="text-sm text-gray-300 space-y-1">

                            <p>
                                📧 {user.email}
                            </p>

                            <p>
                                🏫 {user.collage || "N/A"}
                            </p>

                            <p>
                                🎟️ Proshow:
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${user.proshow
                                    ? "bg-red-600"
                                    : "bg-gray-600"
                                    }`}>
                                    {user.proshow ? "Yes" : "No"}
                                </span>
                            </p>

                            <p>
                                🛏️ Accommodation:
                                <span className={`ml-2 px-2 py-0.5 rounded text-xs ${user.accommodation
                                    ? "bg-blue-600"
                                    : "bg-gray-600"
                                    }`}>
                                    {user.accommodation ? "Yes" : "No"}
                                </span>
                            </p>

                        </div>

                        {/* Events */}
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-red-400 mb-1">
                                Events
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {user?.events?.length > 0 ? (
                                    user.events.map((event, i) => (
                                        <span
                                            key={i}
                                            className="bg-gray-800 px-2 py-1 text-xs rounded"
                                        >
                                            {event.title}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-500 text-xs">
                                        No events
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Payment */}
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-red-400 mb-1">
                                Payment
                            </h3>

                            {user.paymentScreenshot && (
                                <img
                                    src={user.paymentScreenshot}
                                    alt="payment"
                                    className="w-full h-32 object-cover rounded mb-2 border border-gray-700"
                                />
                            )}

                            <p className="text-xs text-gray-400">
                                UPI: {user.upiId || "N/A"}
                            </p>

                            <p className="text-xs text-gray-400">
                                TXN: {user.transactionId || "N/A"}
                            </p>
                        </div>

                        {/* Verify Button */}
                        <button
                            onClick={() => verifyUser(user._id)}
                            disabled={user.verified || verifyingId === user._id}
                            className={`mt-4 w-full py-2 rounded font-semibold transition ${user.verified
                                ? "bg-green-700 cursor-not-allowed"
                                : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {verifyingId === user._id
                                ? "Verifying..."
                                : user.verified
                                    ? "Verified"
                                    : "Verify User"}
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default AdminPage;
