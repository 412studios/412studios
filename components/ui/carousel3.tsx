import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type Carousel3ContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const Carousel3Context = React.createContext<Carousel3ContextProps | null>(
  null,
);

/**
 * A custom React hook that provides access to the Carousel3 context
 * @returns {Object} The Carousel3 context object
 * @throws {Error} If used outside of a Carousel3 component
 */
function useCarousel3() {
  const context = React.useContext(Carousel3Context);

  if (!context) {
    throw new Error("useCarousel3 must be used within a <Carousel3 />");
  }

  return context;
}
/**
 * Creates a customizable carousel component with horizontal or vertical orientation.
 * @param {Object} props - The component props.
 * @param {string} [props.orientation='horizontal'] - The orientation of the carousel ('horizontal' or 'vertical').
 * @param {Object} [props.opts] - Additional options for the Embla Carousel.
 * @param {Function} [props.setApi] - Function to set the Carousel API externally.
 * @param {Array} [props.plugins] - Array of plugins for the Embla Carousel.
 * @param {string} [props.className] - Additional CSS class names for the carousel container.
 * @param {React.ReactNode} props.children - The content to be rendered inside the carousel.
 * @param {React.Ref} ref - Ref object for the carousel container.
 * @returns {JSX.Element} A carousel component with context provider and event handlers.
 */

const Carousel3 = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
      },
      /**
       * Callback function to handle carousel selection and update scroll states
       * @param {CarouselApi | null} api - The Carousel API object or null
       * @returns {void} This function doesn't return a value
       */
      plugins,
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    /**
     * Scrolls to the previous item in the carousel
     * @param {void} - This function doesn't accept any parameters
     * @returns {void} This function doesn't return a value
     */
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    /**
     * Scrolls to the next item using the API's scrollNext method.
     * @param {void} - This function doesn't accept any parameters.
     * @returns {void} This function doesn't return a value.
     */
    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = React.useCallback(
      /**
       * Handles keyboard events for scrolling through a carousel or similar component.
       * @param {React.KeyboardEvent<HTMLDivElement>} event - The keyboard event object.
       * @returns {void} This function does not return a value.
       */
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        /**
         * Updates the API state when the api prop changes
         * @param {function} api - The API function to be set
         * @param {function} setApi - The state setter function for updating the API
         * @returns {void} This effect does not return anything
         */
        }
      },
      [scrollPrev, scrollNext],
    );

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    /**
     * Sets up effect hooks for API selection and reinitialization
     * @param {Object} api - The API object to interact with
     * @param {Function} onSelect - Callback function to handle selection events
     * @returns {Function} Cleanup function to remove event listeners
     */
    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      /**
       * Cleanup function that removes the 'select' event listener from the API
       * @returns {Function} A function that, when called, removes the 'select' event listener
       */
      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <Carousel3Context.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </div>
      </Carousel3Context.Provider>
    );
  },
);
Carousel3.displayName = "Carousel3";
/**
 * A component that renders a carousel with customizable orientation.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS class for styling.
 * @param {React.Ref} ref - Ref object for the inner div element.
 * @returns {JSX.Element} A div containing the carousel structure.
 */

const Carousel3Content = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { carouselRef, orientation } = useCarousel3();

  return (
    <div ref={carouselRef} className="overflow-hidden">
      ```
      /**
       * A carousel slide component that adapts its width/height based on orientation.
       * @param {Object} props - The component props.
       * @param {string} [props.className] - Additional CSS classes to apply to the slide.
       * @param {React.Ref} ref - React ref object for the slide container.
       * @returns {React.ReactElement} A div element representing a carousel slide.
       */
      
      ```      <div
        ref={ref}
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-0" : "-mt-0 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
});
Carousel3Content.displayName = "Carousel3Content";

/**
 * Renders a customizable button component for scrolling to the previous item in a carousel.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.variant="outline"] - The visual variant of the button.
 * @param {string} [props.size="icon"] - The size of the button.
 * @param {React.Ref} ref - A ref object to access the underlying button element.
 * @returns {React.ReactElement} A Button component for scrolling to the previous item.
 */
const Carousel3Item = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel3();

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0",
        // Full width on mobile, 1/3 width on desktop
        orientation === "horizontal" ? "w-full lg:w-1/3" : "h-full lg:h-1/3",
        className,
      )}
      {...props}
    />
  );
});
Carousel3Item.displayName = "Carousel3Item";

const Carousel3Previous = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel3();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full bg-primary border-0 hover:bg-secondary text-background hover:text-primary",
        orientation === "horizontal"
          ? "-left-[25px] top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      {/* <ArrowLeft className="h-4 w-4" /> */}
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
});
Carousel3Previous.displayName = "Carousel3Previous";

const Carousel3Next = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
/**
 * Renders a next button component for a carousel.
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the button.
 * @param {string} [props.variant="outline"] - The button variant.
 * @param {string} [props.size="icon"] - The size of the button.
 * @param {React.Ref} ref - The ref to be forwarded to the Button component.
 * @returns {React.ReactElement} A Button component styled as a next button for the carousel.
 */
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel3();

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        "absolute h-8 w-8 rounded-full bg-primary border-0 hover:bg-secondary text-background hover:text-primary",
        orientation === "horizontal"
          ? "-right-[25px] top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span>
    </Button>
  );
});
Carousel3Next.displayName = "Carousel3Next";

export {
  type CarouselApi,
  Carousel3,
  Carousel3Content,
  Carousel3Item,
  Carousel3Previous,
  Carousel3Next,
};
