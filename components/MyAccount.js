'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '../firebaseConfig/FirebaseClient'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

export default function MyAccount() {
  const router = useRouter()

  const [isApple, setIsApple] = useState(false)
  const [appleData, setAppleData] = useState()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [showDeleteField, setShowDeleteField] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const apple = localStorage.getItem('appleLogin')
    if (apple) {
      const userData = JSON.parse(apple);
      setAppleData(userData)
      setIsApple(true)
    }
  }, [])

  // ✅ Helper: Friendly error messages
  const parseFirebaseError = (code) => {
    switch (code) {
      case 'auth/wrong-password':
        return 'Incorrect current password. Please try again.'
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.'
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait and try again later.'
      case 'auth/requires-recent-login':
        return 'Please log in again before updating your password.'
      default:
        return 'An unexpected error occurred. Please try again.'
    }
  }

  // ✅ Update password
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')

    try {
      const user = auth.currentUser
      if (!user || !user.email) throw new Error('No user is signed in.')

      if (newPassword !== confirmPassword)
        throw new Error('Passwords do not match.')

      if (isApple)
        throw new Error(
          'Password updates are disabled for Apple sign-in accounts.'
        )

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      )

      await reauthenticateWithCredential(user, credential)
      await updatePassword(user, newPassword)
      setSuccess('✅ Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      console.error('Error updating password:', err)
      const message = err.code ? parseFirebaseError(err.code) : err.message
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  // 🚨 Delete account
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'DELETE') {
      setError('Please type DELETE to confirm account removal.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {

      if (isApple){
        
        const res = await fetch('/api/delete-user-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: appleData.email,
          }),
        });
    
        const data = await res.json();
    
        if (!res.ok) throw new Error(data.error || 'Failed to delete user');
        alert('Your account has been permanently deleted.')
        router.push('/logout');

      } else {

        const user = auth.currentUser
        const res = await fetch('/api/delete-user-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: user.email,
          }),
        });
    
        const data = await res.json();
    
        if (!res.ok) throw new Error(data.error || 'Failed to delete user');
        alert('Your account has been permanently deleted.')
        router.push('/logout');
        
      }
    } catch (err) {
      console.error('Error deleting account:', err)
      const message = err.code
        ? parseFirebaseError(err.code)
        : err.message || 'Failed to delete account.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="techwave_fn_image_generation_page">
      <div className="generation__page">
        <div className="generation_header">
          <div className="header_top">
            <h1 className="title">My Account</h1>
          </div>

          <div className="header_bottom" style={{ width: '70%' }}>
            {/* Update Password */}
            <form onSubmit={handlePasswordUpdate}>
              <h2>Update Password</h2>
              <br />

              {isApple && (
                <p style={{ color: 'gray' }}>
                  You signed in with Apple — password change is not available.
                </p>
              )}

              {!isApple && (
                <>
                  <div className="form_group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      className="full_width"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group">
                    <label>New Password</label>
                    <input
                      type="password"
                      className="full_width"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <br />
                  <div className="form_group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      className="full_width"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p style={{ color: 'red', marginTop: '1em' }}>{error}</p>}
                  {success && (
                    <p style={{ color: 'green', marginTop: '1em' }}>{success}</p>
                  )}
                  <br />
                  <div className="generate_section">
                    <button
                      type="submit"
                      className="techwave_fn_button"
                      disabled={loading}
                    >
                      <span>
                        {loading ? (
                          <>
                            Updating <FontAwesomeIcon icon={faSpinner} spin />
                          </>
                        ) : (
                          'Update Password'
                        )}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </form>

            <hr style={{ margin: '2rem 0' }} />

            {/* Delete Account */}
            <div>
              <h2>Delete Account</h2>

              {!showDeleteField ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteField(true)}
                  className="techwave_fn_button"
                  style={{ backgroundColor: 'red', color: "white" }}
                >
                  Delete My Account
                </button>
              ) : (
                <>
                  <p style={{ color: 'gray' }}>
                    Type <strong>DELETE</strong> to confirm your account removal.
                  </p>
                  <div className="form_group">
                    <input
                      type="text"
                      className="full_width"
                      placeholder='Type "DELETE" to confirm'
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                    />
                  </div>
                  <br />
                  <div className="generate_section">
                    <button
                      type="button"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="techwave_fn_button"
                      style={{ backgroundColor: 'red', color: 'white' }}
                    >
                      <span>
                        {loading ? (
                          <>
                            Deleting <FontAwesomeIcon icon={faSpinner} spin />
                          </>
                        ) : (
                          'Confirm Deletion'
                        )}
                      </span>
                    </button>
                  </div>
                </>
              )}

              <p style={{ color: 'gray', marginTop: '1em' }}>
                For additional support, {' '}
                <a href="mailto:contact@vorsto.io">contact@vorsto.io</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}