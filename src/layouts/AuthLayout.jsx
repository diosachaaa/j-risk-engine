import { Outlet } from 'react-router-dom'
import AuthTopbar from '../components/auth/AuthTopbar'
import topPattern from '../assets/images/top.png'
import bottomPattern from '../assets/images/bottom.png'

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <AuthTopbar />

      <div className="auth-background">
        <img
          src={topPattern}
          alt=""
          aria-hidden="true"
          className="auth-pattern auth-pattern-top"
        />
        <img
          src={bottomPattern}
          alt=""
          aria-hidden="true"
          className="auth-pattern auth-pattern-bottom"
        />

        <div className="auth-content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}