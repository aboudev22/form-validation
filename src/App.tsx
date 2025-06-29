import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Dot, LockKeyhole, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod/v4";

const caractere = /[!@#$%^&[*()\],/\\.?":{}|<>]/;

// schema zod
const schema = z.object({
  username: z.string().min(3, { message: "minimum 3 caracteres" }),
  password: z
    .string()
    .min(6, { message: "min 6 caracteres" })
    .refine((val) => /[a-z]/.test(val), { message: "une minuscule" })
    .refine((val) => /[A-Z]/.test(val), { message: "Une majuscule" })
    .refine((val) => /[0-9]/.test(val), { message: "Un chiffre" })
    .refine((val) => caractere.test(val), { message: "Un caracter special" }),
});

type BorderColorType =
  | "#737373"
  | "oklch(79.5% 0.184 86.047)"
  | "oklch(72.3% 0.219 149.579)";

type FormData = z.infer<typeof schema>;

export default function App() {
  const { register, handleSubmit, watch, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Border color
  const [borderNameColor, setBorderNameColor] =
    useState<BorderColorType>("#737373");

  const [borderPasswordColor, setBorderPasswordColor] =
    useState<BorderColorType>("#737373");

  const [focusName, setFocusName] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);

  // live value
  const liveName = watch("username");
  const livePassword = watch("password");

  // live errors
  const [usernameErrors, setUsernameErrors] = useState<null | string>(null);
  const [passwordErrors, setPasswordErrors] = useState<null | string>(null);

  useEffect(() => {
    const result = schema.shape.username.safeParse(liveName);
    setUsernameErrors(result.success ? null : result.error.issues[0].message);
    setBorderNameColor(
      result.success ? "oklch(72.3% 0.219 149.579)" : "#737373"
    );
  }, [liveName]);

  useEffect(() => {
    const password = livePassword || "";
    const tests = [
      password.length >= 6,
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
      /[!@#$%^&*(),.?":{}|<>]/.test(password),
    ];
    const passedCount = tests.filter(Boolean).length;

    // Couleur en fonction du nombre valide
    if (passedCount === 0) {
      setBorderPasswordColor("#737373");
    } else if (passedCount < tests.length) {
      setBorderPasswordColor("oklch(79.5% 0.184 86.047)");
    } else {
      setBorderPasswordColor("oklch(72.3% 0.219 149.579)");
    }
    const result = schema.shape.password.safeParse(livePassword);
    setPasswordErrors(result.success ? null : result.error.issues[0].message);
  }, [livePassword]);

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-white">
      <form
        action=""
        onSubmit={handleSubmit(onSubmit)}
        className="w-xs px-4 gap-2 bg-pink-100 py-10 flex flex-col rounded-md"
      >
        <label htmlFor="" className="text-3xl font-bold">
          You're Almost done
        </label>
        <div
          style={{ borderColor: borderNameColor }}
          className="h-12 px-2 gap-2 flex justify-center items-center w-full rounded-md border-2"
        >
          <User size={16} color="#737373" />
          <div className="relative flex-1 h-full flex items-center">
            <AnimatePresence>
              {usernameErrors && focusName && (
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute text-xs font-light text-red-500 top-0"
                >
                  {usernameErrors}
                </motion.p>
              )}
            </AnimatePresence>
            <input
              type="text"
              onFocus={() => setFocusName(true)}
              {...register("username")}
              placeholder="username..."
              className="focus:outline-none flex-1"
            />
          </div>
          <Dot size={20} color={borderNameColor} />
        </div>
        <div
          style={{ borderColor: borderPasswordColor }}
          className="relative h-12 px-2 gap-2 flex justify-center items-center w-full rounded-md border-2"
        >
          <LockKeyhole size={16} color="#737373" />
          <div className="relative flex-1 h-full flex items-center">
            <AnimatePresence>
              {passwordErrors && focusPassword && (
                <motion.p
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className="absolute text-xs font-light text-red-500 top-0"
                >
                  {passwordErrors}
                </motion.p>
              )}
            </AnimatePresence>
            <input
              onFocus={() => setFocusPassword(true)}
              type="password"
              {...register("password")}
              placeholder="password..."
              className="focus:outline-none flex-1"
            />
          </div>
          <Dot size={20} color={borderPasswordColor} />
        </div>
        <div className="flex flex-row-reverse gap-5">
          <motion.button
            disabled={passwordErrors || usernameErrors ? true : false}
            whileTap={{ scale: 0.9 }}
            className="w-full rounded-md h-12 flex justify-center items-center bg-black text-white disabled:bg-black/50 disabled:text-white/50 font-bold cursor-pointer disabled:cursor-not-allowed"
          >
            Submit
          </motion.button>
          <motion.button
            onClick={() => reset({ username: "", password: "" })}
            type="button"
            whileTap={{ scale: 0.9 }}
            className="w-full rounded-md h-12 flex justify-center text-white items-center font-bold bg-black cursor-pointer"
          >
            reset form
          </motion.button>
        </div>
      </form>
    </div>
  );
}
