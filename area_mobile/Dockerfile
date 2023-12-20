# Use a Flutter SDK image
FROM ghcr.io/cirruslabs/flutter:3.16.3

# Set the working directory in the container
WORKDIR /app

# Copy pubspec.yaml to the container
COPY pubspec.yaml /app/

# Install dependencies
RUN flutter pub get

# Copy the rest of the application code to the container
COPY . /app/

# Build the Flutter application
CMD ["flutter", "build", "apk"]
