type PaginationProps = {
  currentPage: number;
  onChange: (newPage: number) => void;
};

export default function Pagination({ currentPage, onChange }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 w-full dark:text-white ">
      <button
        className="p-2 border rounded-xl cursor-pointer "
        aria-label="Previous Page"
        onClick={() => onChange(currentPage - 1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-left-icon lucide-chevron-left">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <p className="p-2 px-4 border rounded-xl">{currentPage}</p>
      <button
        className="p-2 border rounded-xl cursor-pointer"
        aria-label="Next Page"
        onClick={() => onChange(currentPage + 1)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-right-icon lucide-chevron-right">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
