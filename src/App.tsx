import { zodResolver } from "@hookform/resolvers/zod";
import { Dot, LockKeyhole, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";

export default function App() {
  const schema = z.object({
    username: z.string().min(3, { message: "minimum tree letters" }),
    password: z.string().min(6, { message: "minimum 6 caractere" }),
  });

  type formData = z.infer<typeof schema>;

  const { register, handleSubmit } = useForm<formData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: formData) => {
    console.log(data);
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-100">
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-2 flex-col w-xs bg-pink-100 px-4 py-10 rounded-md"
      >
        <label htmlFor="" className="text-center text-3xl font-bold">
          You're almost done
        </label>
        <div className="w-full flex h-10 px-2 gap-2 items-center border-2 border-pink-500 rounded-sm">
          <UserRound size={20} color="#737373" />
          <input
            {...register("username")}
            type="text"
            placeholder="username"
            className="focus:outline-none flex-1"
          />
          <Dot size={20} color="#f6339a" />
        </div>
        <div className="w-full flex h-10 px-2 gap-2 items-center border-2 border-pink-500 rounded-sm">
          <LockKeyhole size={20} color="#737373" />
          <input
            {...register("password")}
            type="password"
            placeholder="password"
            className="flex-1 focus:outline-none"
          />
          <Dot size={20} color="#f6339a" />
        </div>
        <button
          type="submit"
          className="w-full h-10 bg-pink-500 cursor-pointer rounded-sm"
        >
          Become a Spaceship Member
        </button>
      </form>
    </div>
  );
}
