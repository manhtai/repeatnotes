defmodule RepeatnotesWeb.PageController do
  use RepeatnotesWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
