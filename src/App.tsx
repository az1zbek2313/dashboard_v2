import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/Profile';
import DefaultLayout from './layout/DefaultLayout';
import Categories from './pages/Dashboard/Categories';
import CategoryProducts from './pages/Dashboard/CategoryProducts';
import Products from './pages/Dashboard/Products';
import { AuthProvider, useAuth } from './pages/Authentication/AuthContext';
import ProtectedRoute from './pages/Authentication/ProtectedRoute';
import UserPage from './pages/Dashboard/UserPage';
import UserAdminPage from './pages/Dashboard/AdminPage';
import UserStore from './pages/Dashboard/UserStore';
import StoreProduct from './pages/Dashboard/StoreProduct';
import CategoryFilter from './pages/Dashboard/CategoryFilter';
import StoreById from './pages/Dashboard/StoreById';
import UserById from './pages/Dashboard/UserById';
import MyOffers from './pages/Dashboard/MyOffers';
import MyProductComments from './pages/Dashboard/MyProductComments';
// import { AuthProvider, useAuth } from './AuthContext';
// import ProtectedRoute from './ProtectedRoute';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const { token } = useAuth();

  const isAuthenticated = !!token;

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/auth/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <>
                <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignIn />
              </>
            )
          }
        />
        <Route
          path="/auth/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" />
            ) : (
              <>
                <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
                <SignUp />
              </>
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <ECommerce />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/storeid/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                {/* <ECommerce /> */}
                <StoreById />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <Categories />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <CategoryProducts />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <Products />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <Products />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <UserPage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/userbyid/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <UserById />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <UserAdminPage />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <Profile />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/category-filter"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <DefaultLayout>
                <CategoryFilter />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/store"
          element={
            <ProtectedRoute allowedRoles={['store_admin']}>
              <DefaultLayout>
                <UserStore />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/product"
          element={
            <ProtectedRoute allowedRoles={['store_admin']}>
              <DefaultLayout>
                <StoreProduct />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/myoffers"
          element={
            <ProtectedRoute allowedRoles={['store_admin']}>
              <DefaultLayout>
                <MyOffers />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/myproducts/comments"
          element={
            <ProtectedRoute allowedRoles={['store_admin']}>
              <DefaultLayout>
                <MyProductComments />
              </DefaultLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth/signin" />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
// import { useEffect, useState } from 'react';
// import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
// import Loader from './common/Loader';
// import PageTitle from './components/PageTitle';
// import SignIn from './pages/Authentication/SignIn';
// import SignUp from './pages/Authentication/SignUp';
// import ECommerce from './pages/Dashboard/ECommerce';
// import Profile from './pages/Profile';
// import DefaultLayout from './layout/DefaultLayout';
// import History from './pages/Dashboard/History';
// import Categories from './pages/Dashboard/Categories';
// import CategoryProducts from './pages/Dashboard/CategoryProducts';
// import Products from './pages/Dashboard/Products';
// function App() {
//   const [loading, setLoading] = useState<boolean>(true);
//   const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   useEffect(() => {
//     setTimeout(() => setLoading(false), 1000);
//   }, []);

//   const token = localStorage.getItem('token');

//   const isAuthenticated = !!token;

//   return loading ? (
//     <Loader />
//   ) : isAuthenticated ? (
//     <DefaultLayout>
//       <Routes>
//         <Route
//           path="/auth/signin"
//           element={<Navigate to="/" />}
//         />
//         <Route
//           path="/auth/signup"
//           element={<Navigate to="/" />}
//         />
//         <Route
//           index
//           element={
//             <>
//               <ECommerce />
//             </>
//           }
//         />

//         <Route
//           path="/history"
//           element={
//             <>
//               <History />
//             </>
//           }
//         />
//         <Route
//           path="/categories"
//           element={
//             <>
//               <Categories />
//             </>
//           }
//         />
//         <Route
//           path="/category/:id"
//           element={
//             <>
//               <CategoryProducts />
//             </>

//           }
//         />
//         <Route
//           path="/products"
//           element={
//             <>
//               <Products />
//             </>

//           }
//         />
//         <Route
//           path="/product/:id"
//           element={
//             <>
//               <Products />
//             </>

//           }
//         />
//         <Route
//           path="/profile"
//           element={
//             <>
//               <Profile />
//             </>
//           }
//         />

//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//     </DefaultLayout>
//   ) : (
//     <Routes>
//       <Route
//         path="/auth/signin"
//         element={
//           <>
//             <PageTitle title="Signin | TailAdmin - Tailwind CSS Admin Dashboard Template" />
//             <SignIn />
//           </>
//         }
//       />
//       <Route
//         path="/auth/signup"
//         element={
//           <>
//             <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
//             <SignUp />
//           </>
//         }
//       />
//       <Route path="*" element={<Navigate to="/auth/signin" />} />
//     </Routes>
//   );
// }

// export default App;
