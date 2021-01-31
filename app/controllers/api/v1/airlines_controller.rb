module Api
  module V1
    class AirlinesController < ApplicationController
      protect_from_forgery with: :null_session

      # GET /api/v1/airlines
      def index
        render json: serializer(airlines, options)
      end

      # GET /api/v1/airlines/:slug
      def show
        render json: serializer(airline, options)
      end

      # POST /api/v1/airlines
      def create
        airline = Airline.new(airline_params)

        if airline.save
          render json: serializer(airline)
        else
          render json: errors(airline), status: 422
        end
      end

      # PATCH /api/v1/airlines/:slug
      def update
        airline = Airline.find_by(slug: params[:id])

        if airline.update(airline_params)
          render json: serializer(airline, options)
        else
          render json: errors(airline), status: 422
        end
      end

      # DELETE /api/v1/airlines/:slug
      def destroy
        if airline.destroy
          head :no_content
        else
          render json: errors(airline), status: 422
        end
      end

      private

      # Used For compound documents with fast_jsonapi
      def options
        @options ||= { include: %i[reviews] }
      end

      # Get all airlines
      def airlines
        @airlines ||= Airline.all
      end

      # Get a specific airline
      def airline
        @airline ||= Airline.find_by(slug: params[:id])
      end

      # Strong params
      def airline_params
        params.require(:airline).permit(:name, :image_url)
      end

      # fast_jsonapi serializer
      def serializer(records, options = {})
        AirlineSerializer
          .new(records, options)
          .serialized_json
      end

      # Errors
      def errors(record)
        { errors: record.errors.messages }
      end
    end
  end
end