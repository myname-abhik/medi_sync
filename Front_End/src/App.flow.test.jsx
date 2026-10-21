import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, within, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import store from "./redux/store/store";
import router from "./routes/Router";

// Drives the real app (static mode) the way a user would.
describe("Medisync static-mode flow", () => {
  it("guards private pages, logs in, shops, books a doctor, chats and edits the profile", async () => {
    const user = userEvent.setup();
    render(
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    );
    const go = (path) => act(() => router.navigate(path));

    // private page -> redirected to login
    await go("/user/cart");
    expect(await screen.findByText("Login Page")).toBeInTheDocument();

    // login with the demo account
    await user.click(screen.getByRole("button", { name: /fill in the demo account/i }));
    await user.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/user/cart"));
    expect(await screen.findByText("Your cart is empty")).toBeInTheDocument();

    // products: static data renders, search + category work
    await go("/products");
    expect(await screen.findByText("Paracetamol 500 mg Tablets")).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/search medicines/i), "thermometer");
    expect(screen.queryByText("Paracetamol 500 mg Tablets")).not.toBeInTheDocument();
    expect(screen.getByText("Digital Thermometer")).toBeInTheDocument();
    await user.clear(screen.getByPlaceholderText(/search medicines/i));

    // add two different products, one of them twice
    const addButtons = await screen.findAllByRole("button", { name: "Add to Cart" });
    await user.click(addButtons[0]); // paracetamol 2.40
    await user.click(addButtons[1]); // vitamin c 7.90
    await user.click(screen.getAllByRole("button", { name: /add to cart|added to cart/i })[0]);

    // cart totals are computed, promo + checkout work
    await go("/user/cart");
    expect(await screen.findByText("3 Items")).toBeInTheDocument();
    const summary = screen.getByText("Order Summary").closest("div").parentElement;
    expect(within(summary).getAllByText("$12.70")).toHaveLength(2); // subtotal and total: 2*2.40 + 7.90
    await user.type(screen.getByPlaceholderText("Enter Promo Code"), "medi10");
    await user.click(screen.getByRole("button", { name: "Apply" }));
    expect(await screen.findByText(/MEDI10 applied/)).toBeInTheDocument();
    expect(within(summary).getByText("$11.43")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Buy Now" }));
    expect(await screen.findByText(/Your order is placed/)).toBeInTheDocument();

    // order created a notification
    await go("/user/notifications");
    expect(await screen.findByText(/Order MS-\d+ placed/)).toBeInTheDocument();

    // book a doctor
    await go("/services");
    expect(await screen.findByText("Dr. Ananya Sen")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Unavailable" })[0]).toBeDisabled();
    await user.click(screen.getAllByRole("button", { name: "Book meeting" })[0]);
    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: "Book meeting" }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/user/meetings"));
    expect(await screen.findByText("Dr. Ananya Sen")).toBeInTheDocument();

    // join the (simulated) call
    await user.click(screen.getByRole("button", { name: "Join Now" }));
    expect(await screen.findByRole("button", { name: /leave call/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /leave call/i }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/user/meetings"));

    // prescriptions -> reorder fills the cart
    await go("/user/precriptions");
    expect(await screen.findByText("Seasonal viral fever")).toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "Reorder all" })[0]);
    await waitFor(() => expect(router.state.location.pathname).toBe("/user/cart"));
    expect(await screen.findByText("Digital Thermometer")).toBeInTheDocument();

    // chats get an automatic reply
    await go("/user/chats");
    const box = await screen.findByLabelText("Message");
    await user.type(box, "Thank you doctor");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(await screen.findByText("Thank you doctor")).toBeInTheDocument();
    // the reply shows in the conversation and as the preview in the contact list
    expect((await screen.findAllByText(/You're welcome!/, {}, { timeout: 3000 })).length).toBeGreaterThanOrEqual(1);

    // dashboard edits persist
    await go("/user/dashboard");
    const phone = await screen.findByLabelText("Phone:");
    await user.clear(phone);
    await user.type(phone, "99999 00000");
    await user.click(screen.getByText(/Update Profile/));
    expect(await screen.findByText("Profile updated.")).toBeInTheDocument();

    // cart + meetings survive a "reload" (state re-hydrated from localStorage)
    expect(JSON.parse(localStorage.getItem("medisync_meetings_u-demo"))).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem("medisync_cart_u-demo")).length).toBeGreaterThan(0);

    // unknown routes show the 404 page
    await go("/nope");
    expect(await screen.findByText(/404/)).toBeInTheDocument();
  }, 60000);
});
