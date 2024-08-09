import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash, FaTrash, FaEdit, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";

const PasswordManager = () => {
  const [form, setForm] = useState({
    site: "",
    username: "",
    password: "",
  });
  const [passArray, setPassArray] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    let passwords = localStorage.getItem("passwords");
    if (passwords) {
      setPassArray(JSON.parse(passwords));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleSavedPasswordVisibility = (id) => {
    setVisiblePasswords(prev => ({...prev, [id]: !prev[id]}));
  };

  const savePass = (e) => {
    e.preventDefault();
    toast.success("🔒 Password Saved!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    const newPass = { id: uuidv4(), ...form };
    setPassArray([...passArray, newPass]);
    localStorage.setItem("passwords", JSON.stringify([...passArray, newPass]));
    setForm({
      site: "",
      username: "",
      password: "",
    });
  };

  const del = (id) => {
    let confirmation = window.confirm(
      "Are you sure you want to delete this password?"
    );
    if (confirmation) {
      const updatedArr = passArray.filter((index) => index.id !== id);
      setPassArray(updatedArr);
      localStorage.setItem("passwords", JSON.stringify(updatedArr));
      toast.error("🗑️ Password Deleted!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const edit = (id) => {
    setForm(passArray.filter((index) => index.id === id)[0]);
    setPassArray(passArray.filter((index) => index.id !== id));
  };

  return (
    <div className="container">
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FaLock /> Password Manager
      </motion.h1>
      <form className="form">
        <input
          className="input"
          value={form.site}
          type="text"
          placeholder="Enter Site"
          name="site"
          id="site"
          onChange={handleChange}
        />
        <input
          className="input"
          value={form.username}
          placeholder="Enter Username"
          type="text"
          name="username"
          id="username"
          onChange={handleChange}
        />
        <div className="password-input-wrapper">
          <input
            className="input"
            value={form.password}
            placeholder="Enter Password"
            type={showPassword ? "text" : "password"}
            name="password"
            id="password"
            onChange={handleChange}
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <motion.button
          className="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!form.site || !form.username || !form.password}
          onClick={savePass}
        >
          Save Password
        </motion.button>
      </form>
      <h2 className="subtitle">Your Passwords:</h2>
      {passArray.length === 0 && (
        <p className="no-passwords">No passwords to show</p>
      )}
      {passArray.length !== 0 && (
        <table className="table">
          <thead>
            <tr>
              <th className="table-header">Site Name</th>
              <th className="table-header">Username</th>
              <th className="table-header">Password</th>
              <th className="table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {passArray.map((entry, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <td className="table-cell">{entry.site}</td>
                <td className="table-cell">{entry.username}</td>
                <td className="table-cell">
                  {visiblePasswords[entry.id] ? entry.password : '••••••••'}
                  <span className="password-toggle" onClick={() => toggleSavedPasswordVisibility(entry.id)}>
                    {/* {visiblePasswords[entry.id] ? <FaEyeSlash /> : <FaEye />} */}
                  </span>
                </td>
                <td className="table-cell">
                  <FaTrash
                    className="action-icon"
                    onClick={() => del(entry.id)}
                  />
                  <FaEdit
                    className="action-icon"
                    onClick={() => edit(entry.id)}
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PasswordManager;