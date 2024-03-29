import { ZodType, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../redux/userReducer";

type FormData = {
  username: string;
  password: string;
};

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema: ZodType<FormData> = z.object({
    username: z.string().min(2).max(16),
    password: z.string().min(4).max(32),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleLogin = async (formData: FormData) => {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data === "User does not exist") {
        setError("username", {
          type: "validate",
          message: "User does not exist",
        });
      } else {
        setError("password", {
          type: "validate",
          message: "Incorrect Password",
        });
      }
    } else {
      localStorage.setItem("token", data.acessToken);
      dispatch(userActions.auth(data.payload));
      navigate("/");
    }
  };

  return (
    <div className="flex h-screen min-h-[400px] items-center bg-background px-4 pt-24 text-copy">
      <form
        onSubmit={handleSubmit(handleLogin)}
        className="mx-auto mt-[-150px] min-w-[290px] max-w-[400px] rounded-md bg-foreground px-4 py-6"
      >
        <h1 className="text-center text-xl">Login</h1>

        <FormInput
          label="Username"
          name="username"
          register={register}
          isError={!!errors.username}
          errorMessage={errors.username?.message}
        />
        <div className="mb-2"></div>
        <FormInput
          label="Password"
          name="password"
          type="password"
          register={register}
          isError={!!errors.password}
          errorMessage={errors.password?.message}
        />

        <div className="mb-4"></div>
        <button className="mb-6 w-full bg-border py-1" type="submit">
          Submit
        </button>
        <div className="">
          Don't have an account?{" "}
          <Link className="text-primary" to="/signup">
            Create a new account
          </Link>
        </div>
      </form>
    </div>
  );
}
export default Login;
