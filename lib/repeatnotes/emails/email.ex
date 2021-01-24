defmodule RepeatNotes.Emails.Email do
  import Swoosh.Email

  @from_address System.get_env("FROM_ADDRESS") || "hi@repeatnotes.com"

  def password_reset(%RepeatNotes.Users.User{email: email, password_reset_token: token} = _user) do
    link = "#{get_app_domain()}/reset-password/#{token}"

    new()
    |> to(email)
    |> from({"RepeatNotes", @from_address})
    |> subject("[RepeatNotes] Reset your password")
    |> html_body(password_reset_html(link))
    |> text_body(password_reset_text(link))
  end

  defp password_reset_text(link) do
    """
    Hello!

    Follow the link below to reset your RepeatNotes password:

    #{link}

    Best,
    The RepeatNotes team
    """
  end

  defp password_reset_html(link) do
    """
    <p>Hello!</p>

    <p>Follow the link below to reset your RepeatNotes password:</p>

    <a href="#{link}">#{link}</a>

    <p>
    Best,<br />
    The RepeatNotes team
    </p>
    """
  end

  defp get_app_domain() do
    if Mix.env() == :dev do
      "http://localhost:3333"
    else
      "https://" <> System.get_env("BACKEND_URL", "repeatnotes.com")
    end
  end
end
