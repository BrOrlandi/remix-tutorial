import { json } from "@remix-run/node";

import { Form, Outlet, useMatches, useLocation, Link, useLoaderData, useFetcher } from "@remix-run/react";
import type { FunctionComponent } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import type { ContactRecord } from "../data";
import invariant from "tiny-invariant";

import { getContact } from "../data";

export const loader = async ({ params } : LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
	const contact = await getContact(params.contactId);
	if(!contact) {
		throw new Response("Not Found", { status: 404 });
	}
	return json({ contact });
}

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

	const matches = useMatches();

	const isContactRoute = matches.length === 2;

	const location = useLocation();

  return (
		<div>
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy"
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>


<div>
		{!isContactRoute && <Outlet />}

		{isContactRoute && (
			<div>
				<h2>Click to opa</h2>
				<Link to={location.pathname + '/opa'}>Click here</Link>
			</div>
		)}
		</div>
		</div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {

	const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post" action="favorite">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
};
