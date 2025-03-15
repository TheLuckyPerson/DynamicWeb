import { useActionState } from "react";

export function UsernamePasswordForm(props) {
  const [result, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const username = formData.get("username");
      const password = formData.get("password");

      console.log("Username:", username);
      console.log("Password:", password);

      if (!username || !password) {
        return {
          type: "error",
          message: "Please fill in your username and password.",
        };
      }

      const submitResult = await props.onSubmit(formData);
      return submitResult;
    },
    null
  );

  return (
    <>
      {result && (
        <p className={`message ${result.type} text-red-500`}>{result.message}</p>
      )}
      {isPending && <p className="message loading">Loading ...</p>}
      <form action={submitAction} className="p-4 bg-gray-100 rounded-lg w-80">
        <div className="mb-4">
          <label htmlFor="username" className="block mb-1">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            className="w-full p-2 border rounded-md"
            disabled={isPending}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border rounded-md"
            disabled={isPending}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md"
          disabled={isPending}
        >
          Submit
        </button>
      </form>
    </>
  );
}
