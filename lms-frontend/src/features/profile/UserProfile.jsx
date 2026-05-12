import { useState, useEffect } from 'react';
import { userApi } from '../../api/userApi';
import { useAuth } from '../../store/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getUserIdFromToken } from '../../utils/jwt';
import RoleBadge from '../../components/common/RoleBadge';

const UserProfile = () => {
  const { user } = useAuth();
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = getUserIdFromToken(user?.token);
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const data = await userApi.getById(userId);
        setProfile(data);
        setName(data.fullName || '');
      } catch {
        showError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) fetchProfile();
  }, [showError, user?.token]);

  const handleSave = async () => {
    const userId = getUserIdFromToken(user?.token);
    if (!userId) return;

    try {
      const updated = await userApi.updateProfile(userId, { fullName: name });
      setProfile(updated);
      setEditing(false);
      success('Profile updated');
    } catch {
      showError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-16 text-sm text-muted-foreground">
        Unable to load profile
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account settings</p>
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-semibold">
              {(profile.fullName || profile.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{profile.fullName || 'No name set'}</h2>
              <RoleBadge role={profile.roleName || profile.role} className="mt-1" />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
              {editing ? (
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              ) : (
                <p className="text-sm text-foreground py-2.5">{profile.fullName || 'Not set'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <p className="text-sm text-foreground py-2.5">{profile.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <p className="text-sm text-foreground py-2.5">{profile.roleName || profile.role}</p>
            </div>

            {profile.permissions?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Permissions</label>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {profile.permissions.map((p) => (
                    <span key={p} className="px-2.5 py-1 bg-secondary border border-border rounded-md text-xs text-secondary-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 flex items-center gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setName(profile.fullName || ''); }}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-secondary text-secondary-foreground hover:bg-secondary/80"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
