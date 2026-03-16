import React, { createContext, useState, useEffect, useContext } from "react";
import { url } from "../api";
import { AuthContext } from "./AuthContext"; // Import AuthContext

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useContext(AuthContext); // Get token from AuthContext

    useEffect(() => {
        if (!token) return; // Prevent API call if token is missing

        const fetchProfile = async () => {
            try {
                const response = await fetch(`${url}users/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch profile");

                const data = await response.json();
                setProfile(data);
            } catch (error) {
                console.error("Profile fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]); // Fetch profile whenever the token changes

    return <ProfileContext.Provider value={{ profile, setProfile, loading }}>{children}</ProfileContext.Provider>;
};
