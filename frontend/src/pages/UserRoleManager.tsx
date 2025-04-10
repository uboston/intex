import React, { useEffect, useState } from 'react';

const API_URL = 'https://localhost:5000';

interface User {
  id: string;
  email: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
}

const UserRoleManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/Role/GetUsersWithRoles`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then(setUsers);
  
    fetch(`${API_URL}/Role/UserRoles`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        const withNone = [{ id: 'none', name: 'None' }, ...data];
        setRoles(withNone);
      });
  }, []);
  

  const handleRoleChange = (email: string, newRole: string) => {
    fetch(
      `${API_URL}/Role/AssignRoleToUser?userEmail=${encodeURIComponent(
        email
      )}&roleName=${encodeURIComponent(newRole)}`,
      {
        method: 'PUT',
        credentials: 'include',
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error('Failed to assign role');
        setUsers((prev) =>
          prev.map((user) =>
            user.email === email ? { ...user, role: newRole } : user
          )
        );
      })
      .catch((err) => {
        console.error(err);
        alert('Error assigning new role');
      });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">User Role Management</h2>
      <table className="w-full border rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Current Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.email}</td>
              <td className="p-2">
              <select
                value={user.role || "None"} // fallback to "None" if null/undefined
                onChange={(e) => handleRoleChange(user.email, e.target.value)}
                className="border rounded p-1"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserRoleManager;
