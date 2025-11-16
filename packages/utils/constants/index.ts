// export const StyleBar = [
//   {
//     number: 3,
//     style: "grid grid-cols-3 gap-x-8 gap-y-8 [&>div]:h-[75rem]",
//   },
//   {
//     number: 4,
//     style: "grid grid-cols-4 gap-x-8 gap-y-8 [&>div]:h-[60rem]",
//   },
//   {
//     number: 5,
//     style: " grid grid-cols-5 gap-x-8 gap-y-8 [&>div]:h-[55rem]",
//   },
// ];



export const StyleBar = [
  {
            number: 3,
            style: {
                  display: "grid",
                  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                  gap: "4rem", 
            },
  },
  {
    number: 4,
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
      gap: "2rem",
      
    },
  },
  
  {
    number: 5,
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
      gap: "2rem",
      
    },
  },
];



