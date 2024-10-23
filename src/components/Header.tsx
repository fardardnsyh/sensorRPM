import Button from "./Button";

const Header = () => (
  <header className="px-4 py-6 flex justify-between items-center border-b-2 border-black/5">
    <h1 className="text-2xl font-semibold">
      <span className="-mr-[0.35rem] sm:mr-0">
        C<span className="hidden sm:inline">over</span>
      </span>{" "}
      <span>
        L<span className="hidden sm:inline">etter</span>
      </span>{" "}
      Generator 📝
    </h1>
    <a
      href="https://github.com/MohamedAlosaili/cover-letter-generator"
      target="_blank"
    >
      <Button alt className="px-4 sm:px-8">
        GitHub ⭐
      </Button>
    </a>
  </header>
);

export default Header;
