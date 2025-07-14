"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, ThumbsUp, ThumbsDown, MessageCircle, User, CheckCircle } from "lucide-react"

interface Review {
  id: number
  userName: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
  helpful: number
  size?: string
  color?: string
  images?: string[]
}

const sampleReviews: Review[] = [
  {
    id: 1,
    userName: "Adebayo O.",
    rating: 5,
    title: "Excellent quality jersey!",
    comment:
      "This jersey is amazing! The quality is top-notch and it fits perfectly. The material is comfortable and breathable. Definitely worth the money. Highly recommend to all Manchester United fans!",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
    size: "L",
    color: "Red",
  },
  {
    id: 2,
    userName: "Fatima A.",
    rating: 4,
    title: "Good product, fast delivery",
    comment:
      "The jersey arrived quickly and in perfect condition. The fit is good and the material feels authentic. Only minor issue is that the red color is slightly different from what I expected, but overall very satisfied.",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
    size: "M",
    color: "Red",
  },
  {
    id: 3,
    userName: "Chidi N.",
    rating: 5,
    title: "Perfect for match days!",
    comment:
      "Wore this to Old Trafford and got so many compliments! The quality is exceptional and it's very comfortable to wear for long periods. The authentic feel makes it worth every naira.",
    date: "2024-01-08",
    verified: true,
    helpful: 15,
    size: "XL",
    color: "Red",
  },
  {
    id: 4,
    userName: "Kemi S.",
    rating: 4,
    title: "Great gift for my son",
    comment:
      "Bought this as a gift for my teenage son who is a huge Manchester United fan. He absolutely loves it! The sizing was accurate and the quality exceeded my expectations.",
    date: "2024-01-05",
    verified: true,
    helpful: 6,
    size: "L",
    color: "Red",
  },
]

export function ProductReviews({ productId }: { productId: number }) {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [filterRating, setFilterRating] = useState("all")
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
    size: "",
    color: "",
  })

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  const filteredReviews = reviews
    .filter((review) => filterRating === "all" || review.rating.toString() === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "highest":
          return b.rating - a.rating
        case "lowest":
          return a.rating - b.rating
        case "helpful":
          return b.helpful - a.helpful
        default:
          return 0
      }
    })

  const handleSubmitReview = () => {
    if (!newReview.title || !newReview.comment) {
      alert("Please fill in all required fields")
      return
    }

    const review: Review = {
      id: reviews.length + 1,
      userName: "You",
      rating: newReview.rating,
      title: newReview.title,
      comment: newReview.comment,
      date: new Date().toISOString().split("T")[0],
      verified: false,
      helpful: 0,
      size: newReview.size,
      color: newReview.color,
    }

    setReviews([review, ...reviews])
    setNewReview({ rating: 5, title: "", comment: "", size: "", color: "" })
    setShowReviewForm(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Reviews Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-red-600" />
            Customer Reviews
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Based on {reviews.length} reviews</p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-medium w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <Label className="text-sm font-medium">Sort by:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium">Filter by rating:</Label>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={() => setShowReviewForm(!showReviewForm)} className="bg-red-600 hover:bg-red-700">
          Write a Review
        </Button>
      </div>

      {/* Write Review Form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Rating *</Label>
                <Select
                  value={newReview.rating.toString()}
                  onValueChange={(value) => setNewReview({ ...newReview, rating: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 Stars - Excellent</SelectItem>
                    <SelectItem value="4">4 Stars - Good</SelectItem>
                    <SelectItem value="3">3 Stars - Average</SelectItem>
                    <SelectItem value="2">2 Stars - Poor</SelectItem>
                    <SelectItem value="1">1 Star - Terrible</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Size (if applicable)</Label>
                <Select value={newReview.size} onValueChange={(value) => setNewReview({ ...newReview, size: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Color (if applicable)</Label>
                <Input
                  value={newReview.color}
                  onChange={(e) => setNewReview({ ...newReview, color: e.target.value })}
                  placeholder="e.g., Red"
                />
              </div>
            </div>

            <div>
              <Label>Review Title *</Label>
              <Input
                value={newReview.title}
                onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                placeholder="Summarize your review"
                required
              />
            </div>

            <div>
              <Label>Your Review *</Label>
              <Textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="Share your experience with this product"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={handleSubmitReview} className="bg-red-600 hover:bg-red-700">
                Submit Review
              </Button>
              <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.userName}</span>
                      {review.verified && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified Purchase
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{formatDate(review.date)}</span>
                      {review.size && <span>• Size: {review.size}</span>}
                      {review.color && <span>• Color: {review.color}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              <h4 className="font-medium text-lg mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

              <div className="flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900">
                  <ThumbsDown className="h-4 w-4" />
                  Not helpful
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
            <p className="text-gray-600">
              {filterRating !== "all"
                ? `No reviews with ${filterRating} stars found.`
                : "Be the first to write a review for this product!"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
