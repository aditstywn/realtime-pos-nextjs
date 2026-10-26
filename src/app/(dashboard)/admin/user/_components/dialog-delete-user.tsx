import DialogDelete from "@/components/common/dialog-delete";
import { Profile } from "@/types/auth";
import { startTransition, useActionState, useEffect } from "react";
import { deleteUser } from "../actions";
import { INITIAL_STATE_ACTION } from "@/constants/general-constant";
import { toast } from "sonner";

export default function DialogDeleteUser({
  onSuccess,
  currentData,
  handleChanngeAction,
  open,
}: {
  onSuccess?: () => void;
  currentData?: Profile;
  handleChanngeAction?: (open: boolean) => void;
  open?: boolean;
}) {
  const [deleteUserState, deleteUserAction, isPendingDeleteUser] =
    useActionState(deleteUser, INITIAL_STATE_ACTION);

  const onSubmit = () => {
    const formData = new FormData();
    formData.append("id", currentData?.id || "");
    formData.append("avatar_url", currentData?.avatar_url || "");

    startTransition(() => {
      deleteUserAction(formData);
    });
  };

  useEffect(() => {
    if (deleteUserState.status === "error") {
      toast.error("Delete User Failed", {
        description: deleteUserState.errors?._form?.[0] || "Delete User failed",
      });
    }

    if (deleteUserState.status === "success") {
      toast.success("Delete User Success", {
        description: "Delete User successfully",
      });
      handleChanngeAction?.(false);
      onSuccess?.();
    }
  }, [deleteUserState]);
  return (
    <DialogDelete
      open={open || false}
      onOpenChange={handleChanngeAction || (() => {})}
      title="User"
      onSubmit={onSubmit}
      isLoading={isPendingDeleteUser}
    />
  );
}
