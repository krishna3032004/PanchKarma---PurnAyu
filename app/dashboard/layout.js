// app/dashboard/layout.js
import './dashboard.css'; // Dashboard ka naya CSS yahan se import hota hai

export default function DashboardLayout({ children }) {
  return (
    // Session provider ya doosre providers yahan aa sakte hain
    <>
      {children}
    </>
  );
}