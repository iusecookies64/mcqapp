import { useRef } from "react";
import { Button } from "../../components/button/Button";
import { Input } from "../../components/input/Input";
import "./Signup.style.css";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { useRecoilValue } from "recoil";
import { userDataAtom } from "../../atoms/userAtom";

type SignupForm = {
  username: string;
  password: string;
  email: string;
};

export const Signup = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  // if logged in go to home page
  const userData = useRecoilValue(userDataAtom);
  if (userData.user_id) {
    navigate("/");
  }
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignupForm>();

  const onSubmit: SubmitHandler<SignupForm> = (data) => {
    api.post("/users/signup", data).then(
      (response) => {
        console.log(response);
        toast.success(response.data.message);
        navigate("/signin");
      },
      (err) => {
        errorHandler(err);
      }
    );
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <div className="text-2xl font-medium flex justify-center">Sign Up</div>
        <form
          ref={formRef}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="off"
        >
          <Input
            inputLabel="Username"
            inputType="text"
            placeholder="john"
            register={register("username", { required: true })}
            error={errors.username}
            errorMessage="Username is required"
          />
          <Input
            inputLabel="Email"
            inputType="text"
            placeholder="john@gmail.com"
            register={register("email", {
              required: true,
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            })}
            error={errors.email}
            errorMessage="Enter a valid email"
          />
          <Input
            inputLabel="Password"
            inputType="password"
            placeholder="*******"
            register={register("password", {
              required: true,
              minLength: 6,
              pattern:
                /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{3,}$/,
            })}
            error={errors.password}
            errorMessage="Password must be at least 6 characters long and include at least one uppercase letter, one digit, and one special character."
          />
          <Button className="mt-2" type="submit">
            Submit
          </Button>
        </form>
        <div className="flex justify-center gap-2">
          Already have an account?{" "}
          <span
            className="text-slate-300 cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};
