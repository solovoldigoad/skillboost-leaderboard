{ pkgs, ... }: {
  # Add packages from the Nix package registry to your environment.
  env.packages = [
    pkgs.python311  # For your Python backend
    pkgs.gunicorn   # The server used for deployment
    pkgs.nodejs_22  # For your Node.js frontend
  ];
}
