import { ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { updateContact } from "~/data";

export const action = async ({ params, request }: ActionFunctionArgs) => {
	invariant(params.contactId, "Missing contactId param");
	const formData = await request.formData();

	console.log(params.contactId, formData.get("favorite"));

	return updateContact(params.contactId, {
		favorite: formData.get("favorite") === "true",
	});
}