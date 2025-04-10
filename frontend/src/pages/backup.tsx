// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from '@mui/material';
// // Adjust import to where your Form.tsx lives
// import {
//   addMovie,
//   updateMovie,
//   deleteMovie,
//   fetchMovies,
//   fetchCategories,
//   fetchRatingCategories,
//   getNextShowId,
// } from '../api/MoviesAPI'; // Update paths as needed
// // If you have a custom Pagination component

// import Pagination from '../components/Pagination'; // Update paths as needed
// import Form from '../components/Form'; // Update paths as needed

// export interface movie {
//   showId: string;
//   type: string;
//   title: string;
//   director: string;
//   cast: string;
//   country: string;
//   releaseYear: number;
//   rating: string;
//   duration: string;
//   description: string;
//   categories: string[];
// }

// const AdminPage: React.FC = () => {
//   const [movies, setMovies] = useState<movie[]>([]);
//   const [selectedMovie, setSelectedMovie] = useState<movie | null>(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalPages, setTotalPages] = useState(0);
//   const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
//   const [ratingOptions, setRatingOptions] = useState<string[]>([]);
//   const typeOptions = ['Movie', 'TV Show'];

//   // Pagination state
//   const [pageNumber, setPageNumber] = useState(1);
//   const [pageSize, setPageSize] = useState(10);

//   const paginatedMovies = movies.slice(
//     (pageNumber - 1) * pageSize,
//     pageNumber * pageSize
//   );

//   const loadMovies = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchMovies(pageSize, pageNumber, []);
//       setMovies(data.movies);
//       setTotalPages(Math.ceil(data.totalMovies / pageSize));
//     } catch (error) {
//       setError((error as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMovies();
//     loadOptions();
//   }, [pageSize, pageNumber]);

//   const loadOptions = async () => {
//     const [cats, ratings] = await Promise.all([
//       fetchCategories(),
//       fetchRatingCategories(),
//     ]);
//     setCategoryOptions(cats);
//     setRatingOptions(ratings);
//   };

//   const handleAdd = () => {
//     setSelectedMovie(null);
//     setOpenForm(true);
//   };

//   const handleEdit = (movie: movie) => {
//     setSelectedMovie(movie);
//     setOpenForm(true);
//   };

//   const handleDelete = async (showId: string) => {
//     if (window.confirm('Are you sure you want to delete this movie?')) {
//       await deleteMovie(showId);
//       await loadMovies();
//     }
//   };

//   const handleFormSubmit = async (data: movie) => {
//     if (selectedMovie) {
//       await updateMovie(selectedMovie.showId, data);
//     } else {
//       await addMovie(data);
//     }

//     setOpenForm(false);
//     setSelectedMovie(null);
//     await loadMovies();
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Movies Admin</h1>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleAdd}
//         style={{ marginBottom: '20px' }}
//       >
//         Add New Movie
//       </Button>
//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Show ID</TableCell>
//               <TableCell>Title</TableCell>
//               <TableCell>Director</TableCell>
//               <TableCell>Release Year</TableCell>
//               <TableCell>Rating</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {paginatedMovies.map((movie: movie) => (
//               <TableRow key={movie.showId}>
//                 <TableCell>{movie.showId}</TableCell>
//                 <TableCell>{movie.title}</TableCell>
//                 <TableCell>{movie.director}</TableCell>
//                 <TableCell>{movie.releaseYear}</TableCell>
//                 <TableCell>{movie.rating}</TableCell>
//                 <TableCell>
//                   <Button
//                     variant="outlined"
//                     onClick={() => handleEdit(movie)}
//                     style={{ marginRight: '10px' }}
//                   >
//                     Edit
//                   </Button>
//                   <Button
//                     variant="outlined"
//                     color="error"
//                     onClick={() => handleDelete(movie.showId)}
//                   >
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <Pagination
//         currentPage={pageNumber}
//         totalPages={totalPages}
//         pageSize={pageSize}
//         onPageChange={setPageNumber}
//         onPageSizeChange={(newSize) => {
//           setPageSize(newSize);
//           setPageNumber(1);
//         }}
//       />

//       <Dialog
//         open={openForm}
//         onClose={() => setOpenForm(false)}
//         fullWidth
//         maxWidth="md"
//       >
//         <DialogTitle>
//           {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
//         </DialogTitle>
//         <DialogContent>
//           <Form
//             initialData={selectedMovie || {}}
//             categoryOptions={categoryOptions}
//             ratingOptions={ratingOptions}
//             typeOptions={typeOptions}
//             onSubmit={handleFormSubmit}
//             getNextShowId={getNextShowId}
//           />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default backup;
